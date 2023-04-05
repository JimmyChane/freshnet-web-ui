<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import Input from "@/components/Input.vue";
   import U from "@/U.js";

   export default {
      components: { PopupWindowAction, Input },
      emits: ["callback-cancel", "callback-change"],
      props: {
         value: { type: Object, default: null },
         isShowing: { type: Boolean, default: false },
      },
      data: (c) => ({ customerName: "", customerPhoneNumber: "" }),
      watch: {
         value() {
            this.onNewValue();
         },
      },
      methods: {
         onNewValue() {
            const value = this.value !== null ? this.value : {};
            this.customerName = U.optString(value.name);
            this.customerPhoneNumber = value.phoneNumber
               ? value.phoneNumber.toString()
               : "";
         },
         onChange() {
            this.$emit("callback-change", {
               name: this.customerName,
               phoneNumber: this.customerPhoneNumber,
            });
         },

         focus() {
            this.$refs.InputName.focus();
         },
      },
   };
</script>

<template>
   <PopupWindowAction
      title="Edit Customer"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
      @click-ok="onChange"
      @click-cancel="$emit('callback-cancel')"
      @click-dismiss="() => $emit('callback-dismiss')"
   >
      <div class="WindowCustomer-body">
         <Input
            class="WindowCustomer-input"
            label="Name"
            ref="InputName"
            :isRequired="true"
            :bindValue="customerName"
            @input="(comp) => (customerName = comp.value)"
         />
         <Input
            class="WindowCustomer-input"
            ref="WindowCustomerPhoneNumber"
            label="Phone Number"
            type="tel"
            :bindValue="customerPhoneNumber"
            @input="(comp) => (customerPhoneNumber = comp.value)"
         />
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowCustomer-body {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem 0;

      .WindowCustomer-input {
         max-width: 100%;
         width: 35rem;
         padding: 0.6rem 0.4rem;
         font-size: 1rem;
         margin-top: 0;

         border: none;
         border-bottom: 1px solid hsl(0, 0%, 70%);
         border-radius: 0.2rem;
         background: hsla(0, 0%, 0%, 0.03);
      }
   }
</style>
