<script>
   import Actionbar from "./PanelCustomers-Actionbar.vue";
   import ItemCustomer from "./ItemCustomer.vue";

   import Empty from "@/components/Empty.vue";

   import PageCustomer from "@/pages/customer/PageCustomer.vue";
   import U from "@/U";

   import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";

   export default {
      components: {
         Actionbar,
         DynamicScroller,
         DynamicScrollerItem,
         ItemCustomer,
         Empty,
      },
      emits: ["click-refresh", "click-item-add", "click-item-remove"],
      props: {
         title: { type: String, default: "" },
         items: { type: Array, default: () => [] },
         itemSelected: { type: Object, default: () => null },
      },
      data: (c) => ({ scrollTop: 0, itemSelect: null }),
      computed: {
         iconEmpty: () => PageCustomer.icon.dark.toUrl(),

         filter: (c) => U.optString(c.$route.query.filter),

         listService: (c) => c.items.filter((item) => item.services.length),
         listOrder: (c) => c.items.filter((item) => item.orders.length),
         list: (c) => {
            switch (c.filter) {
               case "service":
                  return c.listService;
               case "order":
                  return c.listOrder;
               default:
                  return c.items;
            }
         },
         myList: (c) => {
            return c.list.map((item) => {
               return { id: c.itemKey(item), item };
            });
         },
      },
      methods: {
         itemKey(item) {
            return `${this.itemName(item)}${this.itemPhoneNumberValue(item)}`;
         },
         itemName(item) {
            return U.optString(item?.name);
         },
         itemPhoneNumberValue(item) {
            return item?.phoneNumber?.value ?? "";
         },
         itemPhoneNumberStr(item) {
            return U.optString(item?.phoneNumber.toUrl());
         },
      },
   };
</script>

<template>
   <div
      class="PanelCustomers"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <Actionbar
         class="PanelCustomers-top"
         :title="title"
         :items="items"
         @click-item-add="() => $emit('click-item-add')"
         @click-refresh="() => $emit('click-refresh')"
      />

      <DynamicScroller
         class="PanelCustomers-body"
         :items="myList"
         :min-item-size="90"
      >
         <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
               :item="item"
               :data-index="index"
               :active="active"
            >
               <div class="PanelCustomers-item-div">
                  <router-link
                     class="PanelCustomers-item"
                     :to="{
                        query: {
                           name: itemName(item.item),
                           phoneNumber: itemPhoneNumberValue(item.item),
                        },
                     }"
                  >
                     <ItemCustomer
                        :item="item.item"
                        :selected="item.item === itemSelected"
                        @click-remove="
                           (param) =>
                              $emit('click-item-remove', { item: item.item })
                        "
                     />
                  </router-link>
               </div>
            </DynamicScrollerItem>
         </template>
      </DynamicScroller>

      <Empty
         v-if="!list.length && !customerStore.getters.isLoading"
         :icon="iconEmpty"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PanelCustomers {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: stretch;

      .PanelCustomers-top {
         z-index: 2;
         position: sticky;
         top: 0;
         left: 0;
         right: 0;
      }
      .PanelCustomers-body {
         --gap: 4px;

         z-index: 1;
         padding: calc(1rem - var(--gap) * 0.5) 1rem;
         padding-bottom: 10rem;
         display: flex;
         flex-direction: column;
         align-items: center;

         .PanelCustomers-item-div {
            display: flex;
            padding: calc(var(--gap) * 0.5) 0;
         }
         .PanelCustomers-item {
            margin: 0 auto;
            width: 100%;
            max-width: 35rem;
            max-width: 25rem;

            text-decoration: none;
            font-size: 1rem;
            color: inherit;
            overflow: hidden;
         }
      }
   }
</style>
