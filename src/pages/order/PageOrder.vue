<script>
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Loading from "@/components/Loading";
   import Input from "@/components/Input.vue";

   import Actionbar from "./Actionbar.vue";
   import SectionOrder from "./SectionOrder.vue";
   import ActionBarManage from "@/pages/manage/ActionBarManage.vue";
   import U from "@/U";

   import Order from "@/items/Order.js";

   export default {
      key: "order",
      name: "ViewOrder",
      title: "Orders",
      icon: { light: "order-FFFFFF", dark: "order-000000" },
      userPermissions: ["admin", "staff"],

      components: {
         PopupWindow,
         Loading,
         ActionBarManage,
         Actionbar,
         SectionOrder,
         Input,
      },
      emits: ["callback-side-expand"],
      data() {
         return {
            display: { showDialogAppendOrder: false },

            contentError: "",

            customer_name: "",
            phone_number: "",
            content: "",

            scrollTop: 0,

            pendingItems: [],
            completedItems: [],
         };
      },
      computed: {
         isLoading: (c) => c.orderStore.getters.isLoading,
         items: (c) => U.optArray(c.orderStore.getters.items),
         currentExpandedOrderid: (c) => c.$route.query.order,
      },
      watch: {
         "orderStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.pendingItems = [];
            this.completedItems = [];

            const groups = await this.orderStore.dispatch("getGroupsByStatus");
            const groupPending = groups.find((group) => {
               return group.status === Order.STATUS_PENDING;
            });
            const groupCompleted = groups.find((group) => {
               return group.status === Order.STATUS_COMPLETED;
            });

            this.pendingItems = groupPending ? groupPending.items : [];
            this.completedItems = groupCompleted ? groupCompleted.items : [];
         },
         clickRefresh() {
            this.orderStore.dispatch("refresh").catch((error) => {
               this.$root.feedback("Error While Refreshing Order");
               console.error(error);
            });
         },
         createOrder() {
            const { customer_name, phone_number, content } = this;

            if (content.trim() === "") {
               this.contentError = "Missing Content";
               return;
            }

            const order = {
               customer_name: customer_name.trim(),
               phone_number: phone_number.trim(),
               content: content.trim(),
            };

            if (order.customer_name === "") delete order.customer_name;
            if (order.phone_number === "") delete order.phone_number;

            this.orderStore
               .dispatch("addItem", { data: order })
               .then((order) => {
                  this.inputCustomerName = "";
                  this.phone_number = "";
                  this.content = "";
                  this.display.showDialogAppendOrder = false;
               })
               .catch((error) => {
                  this.$root.feedback("Error While Creating Order");
               });
         },
      },
   };
</script>

<template>
   <div
      class="PageOrder"
      ref="orderRoot"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <Actionbar
         class="PageOrder-actionbar"
         :hasShadow="scrollTop > 0"
         :title="$options.title"
         :items="items"
         @click-item="(item) => $root.replaceRoute({ query: { order: item.id } })"
         @click-item-add="
            () => (display.showDialogAppendOrder = !display.showDialogAppendOrder)
         "
         @click-refresh="() => clickRefresh()"
         @click-drawer-expand="$emit('click-drawer-expand')"
      />

      <main>
         <SectionOrder
            class="main-section"
            title="Pending"
            :items="pendingItems"
            :currentItemIdSelected="currentExpandedOrderid"
            @click-collapse="(item) => $root.replaceRoute({ query: { order: null } })"
            @click-expand="(item) => $root.replaceRoute({ query: { order: item.id } })"
            @click-complete="
               (item) => orderStore.dispatch('updateToCompletedOfId', item.id)
            "
            @click-remove="
               (item) => orderStore.dispatch('removeOItemOfId', { id: item.id })
            "
         />

         <SectionOrder
            class="main-section"
            title="Completed"
            :items="completedItems"
            :currentItemIdSelected="currentExpandedOrderid"
            @click-collapse="(item) => $root.replaceRoute({ query: { order: null } })"
            @click-expand="(item) => $root.replaceRoute({ query: { order: item.id } })"
            @click-pending="(item) => orderStore.dispatch('updateToPendingOfId', item.id)"
            @click-remove="
               (item) => orderStore.dispatch('removeOItemOfId', { id: item.id })
            "
         />
      </main>

      <Loading class="viewOrder-loading" :isRunning="orderStore.getters.isLoading" />

      <PopupWindow
         :style="{ 'z-index': '20' }"
         :isShowing="display.showDialogAppendOrder"
         @click-dismiss="display.showDialogAppendOrder = false"
      >
         <div class="pageOrder-dialog-newOrder-body">
            <h1>New Order</h1>

            <Input
               class="PageOrder-input"
               label="Customer Name"
               :bindValue="customer_name"
               @input="(comp) => (customer_name = comp.value)"
            />
            <Input
               class="PageOrder-input"
               label="Customer Phone Number"
               :bindValue="phone_number"
               @input="(comp) => (phone_number = comp.value)"
            />

            <Input
               class="PageOrder-input"
               label="Content"
               :isRequired="true"
               :error="contentError"
               :bindValue="content"
               @input="(comp) => (content = comp.value)"
            />

            <div class="buttons">
               <div class="body">
                  <button
                     class="button-focus-none"
                     @click="display.showDialogAppendOrder = false"
                  >
                     Cancel
                  </button>
               </div>

               <div class="body">
                  <button class="button-focus" @click="createOrder">Submit</button>
               </div>
            </div>
         </div>
      </PopupWindow>
   </div>
</template>

<style lang="scss" scoped>
   .PageOrder {
      --width-max: 550px;

      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-items: stretch;

      overflow-y: auto;
      height: 100%;
      width: 100%;
      padding-bottom: 80px;
      transition: var(--transition-duration);

      main {
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;
         padding-top: 10px;

         .main-section {
            margin-top: 10px;
            margin-bottom: 20px;
            background-color: white;
            box-shadow: 0 2px 4px #b5b5b5;
            padding: 10px;
            transition: var(--transition-duration);
         }
         @media (min-width: 550px) {
            padding-left: 20px;
            padding-right: 20px;
            .main-section {
               border-radius: 1rem;
            }
         }
      }

      .viewOrder-item {
         .viewOrder-item-seperator {
            margin: 4px 0;
            min-width: auto;
            min-height: 0.5px;
            background-color: hsl(0, 0%, 84%);
            background: hsla(0, 0%, 0%, 0.1);
         }
      }

      .viewOrder-loading {
         position: absolute;
      }
   }

   .pageOrder-dialog-newOrder-body {
      --color-shadow: #000000e5;
      --max-width: 500px;
      --padding-horizontal: 30px;
      --padding-vertical: 40px;
      --gap-all: 10px;

      width: 100vw;
      max-width: 500px;
      height: max-content;
      align-self: center;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      background-color: white;
      border-radius: 10px;
      padding: 80px 60px;
      overflow-x: hidden;
      overflow-y: auto;
      cursor: initial;
      pointer-events: unset;

      .PageOrder-input {
         margin-top: 2rem;
      }

      h1 {
         margin-bottom: 10px;
      }

      .buttons {
         display: flex;
         flex-direction: row;
         column-gap: 30px;
         margin-top: 40px;

         .body {
            width: calc(100% - 20px);
            max-width: calc(var(--width-max) - 20px);

            display: flex;
            flex-direction: row;
            flex-basis: auto;

            flex-grow: 1;

            button {
               flex-grow: 1;

               border: none;
               border-radius: 10px;

               padding: 10px 20px;
               color: white;
               font-weight: 600;
               background-color: var(--accent-color);
               transition: all var(--transition-duration) linear;

               cursor: pointer;

               outline: none;

               &:hover,
               &:focus {
                  box-shadow: 0 0 8px #828282;
               }
            }

            .button-focus-none {
               border: 2px solid var(--accent-color);
               background-color: white;
               color: var(--accent-color);

               &:hover,
               &:focus {
                  background-color: var(--accent-color);
                  color: white;
               }
            }

            .button-focus {
               border: 2px solid var(--accent-color);
               background-color: var(--accent-color);
               color: white;

               &:hover,
               &:focus {
                  border: 2px solid var(--accent-color);
                  background-color: var(--accent-color);
               }
            }
         }
      }
   }
</style>
