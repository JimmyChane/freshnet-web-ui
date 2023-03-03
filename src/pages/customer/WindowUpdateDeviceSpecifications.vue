<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import WindowSection from "./WindowSection.vue";
   import SpecificationInputs from "./SpecificationInputs.vue";
   import CustomerModule from "@/items/data/Customer.js";
   import SpecificationModule from "@/items/data/CustomerDeviceSpecification.js";

   export default {
      components: { PopupWindowAction, WindowSection, SpecificationInputs },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: {
         isShowing: { type: Boolean, default: false },
         param: { type: Object, default: () => null },
      },
      data: (c) => ({ Requirement: CustomerModule.Requirement, data: {} }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isClickable: (c) => !c.customerStore.getters.isLoading,

         customer: (c) => {
            if (!c.param) return;
            const { customer } = c.param;
            return customer;
         },
         device: (c) => {
            if (!c.param) return;
            const { device } = c.param;
            return device;
         },
         specifications: (c) => {
            if (!c.param) return [];
            const { specifications } = c.param;
            if (!Array.isArray(specifications)) return [];
            return [...specifications];
         },
      },
      watch: {
         param() {
            this.invalidateData();
         },
      },
      created() {
         this.clearData();
         this.invalidateData();
      },
      mounted() {
         this.clearData();
         this.invalidateData();
      },
      methods: {
         clearData() {
            this.clearDataOnDelay(0);
         },
         clearDataOnDelay(delay = 0) {
            if (delay) {
               setTimeout(() => this.clearDataOnDelay(0), delay);
               return;
            }

            this.data = {};
            this.invalidateData();
         },
         invalidateData() {
            this.data.specifications = this.specifications.map((specification) =>
               SpecificationModule.trim(specification),
            );
         },

         clickOk() {
            this.customerStore
               .dispatch("updateDeviceSpecifications", {
                  _id: this.device.id,
                  specifications: this.data.specifications,
               })
               .then((item) => {
                  this.$emit("click-ok", { item });
                  this.clearDataOnDelay(700);
               });
         },
      },
   };
</script>

<template>
   <PopupWindowAction
      class="WindowUpdateDeviceSpecifications"
      :title="`Update Device Specifications${customer ? ` for ${customer.name}` : ''}`"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="$emit('click-dismiss')"
      @click-cancel="
         $emit('click-cancel');
         clearDataOnDelay(700);
      "
      @click-ok="clickOk()"
   >
      <div class="WindowUpdateDeviceSpecifications-body">
         <WindowSection class="WindowUpdateDeviceSpecifications-description">
            <SpecificationInputs :items="data.specifications" />
         </WindowSection>
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateDeviceSpecifications-reuse-input {
      font-size: 1rem;
      border: none;
      background: hsla(0, 0%, 0%, 0.03);
      border-bottom: 1px solid hsl(0, 0%, 70%);
      border-radius: 0.2rem;
      padding: 0.2rem 0.4rem;
   }

   .WindowUpdateDeviceSpecifications {
      width: 100%;
      height: 100%;
      .WindowUpdateDeviceSpecifications-body {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         gap: 40px;

         .WindowUpdateDeviceSpecifications-customer {
            .WindowUpdateDeviceSpecifications-customer-body {
               display: flex;
               flex-direction: column;
               gap: 0.5rem;
               .WindowUpdateDeviceSpecifications-customer-part {
                  width: 100%;
                  min-height: 2.5rem;
                  display: flex;
                  flex-direction: row;
                  column-gap: 1rem;
                  .WindowUpdateDeviceSpecifications-customer-title {
                     flex-grow: 0;
                     max-width: 120px;
                     min-width: 120px;
                  }
                  .WindowUpdateDeviceSpecifications-reuse-input {
                     flex-grow: 1;
                  }
               }
            }
         }
         .WindowUpdateDeviceSpecifications-description {
            .WindowUpdateDeviceSpecifications-reuse-input {
               height: 6rem;
               resize: none;
            }
         }
      }
   }
</style>
