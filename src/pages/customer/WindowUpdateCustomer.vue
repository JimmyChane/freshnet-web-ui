<script>
   import WindowAction from "@/components/window/WindowAction.vue";
   import WindowSection from "./WindowSection.vue";
   import CustomerModule from "@/items/data/Customer.js";
   import Input from "@/components/Input.vue";

   export default {
      components: { WindowAction, WindowSection, Input },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: {
         isShowing: { type: Boolean, default: false },
         item: { type: Object, default: () => null },
      },
      data: (c) => ({ Requirement: CustomerModule.Requirement, data: {} }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isClickable: (c) => !c.customerStore.getters.isLoading,
      },
      watch: {
         isShowing() {
            if (!this.isShowing) return;
            const { CustomerName } = this.$refs;
            if (CustomerName) {
               CustomerName.focus();
            }
         },
         item() {
            this.bindData();
         },
      },
      created() {
         this.resetData();
      },
      mounted() {
         this.resetData();
      },
      methods: {
         resetData() {
            this.resetDataOnDelay(0);
         },
         resetDataOnDelay(delay = 0) {
            if (delay) {
               setTimeout(() => this.resetDataOnDelay(0), delay);
               return;
            }

            this.data = { name: "", phoneNumber: "" };

            this.bindData();
         },
         bindData() {
            if (this.item) {
               const { name, phoneNumber } = this.item;
               this.data.name = name;
               this.data.phoneNumber = phoneNumber;
            }
         },

         clickOk() {
            this.data.name = this.data.name.trim();
            this.data.phoneNumber = this.data.phoneNumber.trim();

            if (this.Requirement.name.isRequired && !this.data.name) {
               this.store.dispatch(
                  "snackbarShow",
                  'You must specify the "Name"',
               );
            } else if (
               this.Requirement.phoneNumber.isRequired &&
               !this.data.phoneNumber
            ) {
               this.store.dispatch(
                  "snackbarShow",
                  'You must specify the "Phone Number"',
               );
            } else {
               this.customerStore
                  .dispatch("updateNamePhoneNumberOfItemId", {
                     _id: this.item.id,
                     name: this.data.name,
                     phoneNumber: this.data.phoneNumber,
                  })
                  .then((item) => {
                     this.$emit("click-ok", { item });
                     this.resetDataOnDelay(700);
                  });
            }
         },
      },
   };
</script>

<template>
   <WindowAction
      class="WindowUpdateCustomer"
      :title="`Update Customer${item ? ` for ${item.name}` : ''}`"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="$emit('click-dismiss')"
      @click-cancel="
         $emit('click-cancel');
         resetDataOnDelay(700);
      "
      @click-ok="clickOk()"
   >
      <div class="WindowUpdateCustomer-body">
         <WindowSection class="WindowUpdateCustomer-customer">
            <div class="WindowUpdateCustomer-customer-body">
               <Input
                  class="WindowUpdateCustomer-customer-part"
                  label="Name"
                  type="text"
                  :isRequired="true"
                  :bindValue="data.name"
                  @input="(comp) => (data.name = comp.value)"
               />
               <Input
                  class="WindowUpdateCustomer-customer-part"
                  label="Phone Number"
                  type="text"
                  :bindValue="data.phoneNumber"
                  @input="(comp) => (data.phoneNumber = comp.value)"
               />
            </div>
         </WindowSection>
      </div>
   </WindowAction>
</template>

<style lang="scss" scoped>
   .WindowUpdateCustomer-reuse-input {
      font-size: 1rem;
      border: none;
      background: hsla(0, 0%, 0%, 0.03);
      border-bottom: 1px solid hsl(0, 0%, 70%);
      border-radius: 0.2rem;
      padding: 0.2rem 0.4rem;
   }

   .WindowUpdateCustomer {
      width: 100%;
      height: 100%;
      .WindowUpdateCustomer-body {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         gap: 40px;

         .WindowUpdateCustomer-customer {
            .WindowUpdateCustomer-customer-body {
               width: 100%;
               display: flex;
               flex-direction: column;
               gap: 1rem;
               .WindowUpdateCustomer-customer-part {
                  width: 100%;
                  min-height: 2.5rem;
               }
            }
         }
      }
   }
</style>
