<script>
   import Button3 from "@/components/button/Button3.vue";
   import LabelCount from "@/components/LabelCount.vue";
   import ItemDeviceCount from "./ItemDeviceCount.vue";

   export default {
      components: { Button3, LabelCount, ItemDeviceCount },
      emtis: ["click", "click-remove"],
      props: {
         item: { type: Object, default: null },
         selected: { type: Boolean, default: false },
      },
      data: (c) => ({ itemDeviceGroups: [] }),
      computed: {
         name: (c) => c.item.name,
         phoneNumber: (c) => c.item.phoneNumber,
         phoneNumberStr: (c) => (c.phoneNumber ? c.phoneNumber.toString() : ""),
         services() {
            if (this.item) return this.item.services;
            return [];
         },
         orders() {
            if (this.item) return this.item.orders;
            return [];
         },
      },
      watch: {
         item() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.itemDeviceGroups = [];
            if (!this.item) return;
            this.itemDeviceGroups = await this.item.fetchDeviceGroups("categoryKey");
         },
      },
   };
</script>

<template>
   <Button3 class="ItemCustomer" :isSelected="selected" @focus="$emit('click', { item })">
      <div class="ItemCustomer-body">
         <div class="ItemCustomer-header">
            <span class="ItemCustomer-name">{{ name }}</span>
            <div class="ItemCustomer-header-dot" v-if="name && phoneNumberStr" />
            <span class="ItemCustomer-phoneNumber">{{ phoneNumberStr }}</span>
         </div>

         <div
            class="ItemCustomer-main"
            v-if="
               item.description ||
               itemDeviceGroups.length ||
               services.length ||
               orders.length
            "
         >
            <div class="ItemCustomer-description" v-if="item.description">
               <span class="ItemCustomer-description-body">{{ item.description }}</span>
            </div>

            <div class="ItemCustomer-labels">
               <ItemDeviceCount
                  v-for="group of itemDeviceGroups"
                  :key="group.categoryKey"
                  :categoryKey="group.categoryKey"
                  :count="group.devices.length"
               />
               <LabelCount
                  v-if="services.length"
                  :icon="host.icon('service-FFFFFF')"
                  :count="services.length"
               />
               <LabelCount
                  v-if="orders.length"
                  :icon="host.icon('order-FFFFFF')"
                  :count="orders.length"
               />
            </div>
         </div>
      </div>
   </Button3>
</template>

<style lang="scss" scoped>
   .ItemCustomer {
      width: 100%;
      background-color: white;

      .ItemCustomer-body {
         width: 100%;
         font-weight: 400;
         font-size: 1rem;
         color: black;
         text-align: start;
         flex-grow: 1;
         height: unset;
         padding: 0.5rem 0.3rem;

         display: flex;
         flex-direction: column;
         align-items: stretch;

         .ItemCustomer-header {
            padding: 0.3rem 0.5rem;
            width: 100%;
            column-gap: 0.5rem;
            color: black;

            display: flex;
            flex-direction: row;
            align-items: center;

            .ItemCustomer-header-dot {
               --size: 4px;
               width: var(--size);
               height: var(--size);
               min-height: var(--size);
               max-width: var(--size);
               min-width: var(--size);
               max-height: var(--size);
               display: flex;
               background: #2a4858;
               border-radius: 50%;
            }
         }
         .ItemCustomer-main {
            padding: 0.3rem 0.5rem;
            line-height: 1.1;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 0.2rem;

            .ItemCustomer-noContent {
               width: 100%;
               display: flex;
               line-height: 1.1;
               font-size: 0.6rem;
               white-space: pre-line;
            }

            .ItemCustomer-description {
               width: 100%;
               display: flex;
               flex-direction: column;
               .ItemCustomer-description-body {
                  width: 100%;
                  display: flex;
                  line-height: 1.1;
                  font-size: 0.9rem;
                  white-space: pre-line;
               }
            }
            .ItemCustomer-labels {
               display: flex;
               flex-direction: row;
               align-items: flex-start;
               font-size: 1rem;
               gap: 0.1rem;
               & > * {
                  --primary-color: #444;
                  border-radius: 0.5rem;
                  padding: 0.4rem;
               }
            }
         }
      }
   }
</style>
