<script>
   import ItemButton from "@/pages/manage/PanelItems-ItemButton.vue";
   import Label from "./ItemCustomer-Label.vue";
   import LabelDevice from "./ItemCustomer-LabelDevice.vue";

   export default {
      components: { ItemButton, Label, LabelDevice },
      emtis: ["click", "click-remove"],
      props: {
         item: { type: Object, default: null },
         selected: { type: Boolean, default: false },
      },
      data: (c) => ({ itemDeviceGroups: [] }),
      computed: {
         name: (c) => c.item.name,
         phoneNumber: (c) => c.item.phoneNumber,
         phoneNumberStr: (c) => c.phoneNumber?.toString() ?? "",
         services: (c) => c.item?.services ?? [],
         orders: (c) => c.item?.orders ?? [],
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

            const previousName = this.name;
            const previousPhoneNumberStr = this.phoneNumberStr;

            const itemDeviceGroups = await this.item.fetchDeviceGroups(
               "categoryKey",
            );

            if (
               previousName === this.name &&
               previousPhoneNumberStr === this.phoneNumberStr
            ) {
               this.itemDeviceGroups = itemDeviceGroups;
            }
         },
      },
   };
</script>

<template>
   <ItemButton
      class="ItemCustomer"
      :isSelected="selected"
      @focus="$emit('click', { item })"
   >
      <div class="ItemCustomer-body">
         <div class="ItemCustomer-header">
            <span>{{ name }}</span>
            <span>{{ phoneNumberStr }}</span>
         </div>

         <div
            class="ItemCustomer-labels"
            v-if="
               item.description ||
               itemDeviceGroups.length ||
               services.length ||
               orders.length
            "
         >
            <LabelDevice
               v-for="group of itemDeviceGroups"
               :key="group.categoryKey"
               :categoryKey="group.categoryKey"
               :count="group.devices.length"
            />
            <Label
               v-if="services.length"
               :icon="host.icon('service-505050')"
               :count="services.length"
            />
            <Label
               v-if="orders.length"
               :icon="host.icon('order-505050')"
               :count="orders.length"
            />
         </div>
      </div>
   </ItemButton>
</template>

<style lang="scss" scoped>
   .ItemCustomer {
      width: 100%;
      background: white;

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
         flex-direction: row;
         align-items: stretch;

         .ItemCustomer-header {
            padding: 0.3rem 0.5rem;
            width: 100%;
            column-gap: 0.5rem;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            :nth-child(1) {
               font-size: 1em;
               color: black;
            }
            :nth-child(2) {
               font-size: 0.8em;
               color: rgba(0, 0, 0, 0.8);
            }
         }

         .ItemCustomer-labels {
            padding: 0.3rem 0.5rem;
            font-size: 1rem;
            gap: 0.1rem;
            display: flex;
            flex-direction: row;
            align-items: center;

            & > * {
               --primary-color: black;
               border-radius: 0.5rem;
               padding: 0.4rem;
            }
         }
      }
   }
</style>
