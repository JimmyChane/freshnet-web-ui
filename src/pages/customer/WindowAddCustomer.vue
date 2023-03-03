<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import Input from "@/components/Input.vue";
   import TextArea from "@/components/InputTextArea.vue";
   import CustomerModule from "@/items/data/Customer.js";

   export default {
      components: { PopupWindowAction, Input, TextArea },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: { isShowing: { type: Boolean, default: false } },
      data: (c) => ({ Requirement: CustomerModule.Requirement, data: {} }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isClickable: (c) => !c.customerStore.getters.isLoading,
      },
      watch: {
         isShowing() {
            if (!this.isShowing) return;
            const { CustomerName } = this.$refs;
            if (CustomerName) CustomerName.focus();
         },
      },
      created() {
         this.resetData();
      },
      mounted() {
         this.resetData();
      },
      methods: {
         resetData(delay = 0) {
            if (delay) {
               setTimeout(() => this.resetData(0), delay);
               return;
            }

            this.data = {
               name: "",
               phoneNumber: "",
               description: "",
            };
         },

         clickOk() {
            this.data.name = this.data.name.trim();
            this.data.phoneNumber = this.data.phoneNumber.trim();
            this.data.description = this.data.description.trim();

            if (this.Requirement.name.isRequired && !this.data.name) {
               this.store.dispatch("snackbarShow", 'You must specify the "Name"');
            } else if (
               this.Requirement.phoneNumber.isRequired &&
               !this.data.phoneNumber
            ) {
               this.store.dispatch("snackbarShow", 'You must specify the "Phone Number"');
            } else if (
               this.Requirement.description.isRequired &&
               !this.data.description
            ) {
               this.store.dispatch("snackbarShow", 'You must specify the "Description"');
            } else {
               this.customerStore.dispatch("addItem", this.data).then((item) => {
                  this.$emit("click-ok", { item });
                  this.resetData(700);
               });
            }
         },
      },
   };
</script>

<template>
   <PopupWindowAction
      class="WindowAddCustomer"
      title="Add New Customer"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="$emit('click-dismiss')"
      @click-cancel="
         () => {
            $emit('click-cancel');
            resetData(700);
         }
      "
      @click-ok="clickOk()"
   >
      <div class="WindowAddCustomer-body">
         <Input
            class="WindowAddCustomer-customer-input"
            label="Name"
            type="text"
            :isRequired="true"
            :bindValue="data.name"
            @input="(comp) => (data.name = comp.value)"
         />
         <Input
            class="WindowAddCustomer-customer-input"
            label="Phone Number"
            type="text"
            :bindValue="data.phoneNumber"
            @input="(comp) => (data.phoneNumber = comp.value)"
         />
         <TextArea
            class="WindowAddCustomer-description-input"
            type="text"
            label="Description"
            :bindValue="data.description"
            @input="(comp) => (data.description = comp.value)"
         />
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowAddCustomer {
      width: 100%;
      height: 100%;
      .WindowAddCustomer-body {
         width: 26rem;
         max-width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         gap: 0.7rem;

         .WindowAddCustomer-customer-input {
            background: hsla(0, 0%, 0%, 0.03);
         }
         .WindowAddCustomer-description-input {
            height: 7rem;
            background: hsla(0, 0%, 0%, 0.03);
         }
      }
   }
</style>
