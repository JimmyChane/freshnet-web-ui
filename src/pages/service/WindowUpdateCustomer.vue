<script>
   import Window from "@/components/window/Window.vue";
   import Input from "@/components/Input.vue";

   import LayoutNumpad from "./LayoutNumpad.vue";

   import U from "@/U.js";

   export default {
      components: { Window, Input, LayoutNumpad },
      emits: ["callback-cancel", "callback-change"],
      props: {
         value: { type: Object, default: null },
      },
      data: (c) => ({ customerName: "", customerPhoneNumber: "" }),
      watch: {
         value: function () {
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

         insertNumber(number) {
            this.customerPhoneNumber = `${this.customerPhoneNumber}${number}`;
         },
         backspaceNumber() {
            if (this.customerPhoneNumber.length == 0) return;

            this.customerPhoneNumber = this.customerPhoneNumber.substring(
               0,
               this.customerPhoneNumber.length - 1,
            );
         },

         focus() {
            this.$refs.InputName.focus();
         },
      },
   };
</script>

<template>
   <Window
      class="WindowCustomer"
      title="Edit Customer"
      @click-cancel="$emit('callback-cancel')"
      @click-ok="onChange"
   >
      <Input
         class="WindowCustomer-input"
         label="Name"
         ref="InputName"
         :isRequired="true"
         :bindValue="customerName"
         @input="(comp) => (customerName = comp.value)"
      />
      <div class="WindowCustomer-phoneNumber">
         <Input
            class="WindowCustomer-input"
            ref="WindowCustomerPhoneNumber"
            label="Phone Number"
            type="tel"
            :bindValue="customerPhoneNumber"
            @input="(comp) => (customerPhoneNumber = comp.value)"
         />
         <LayoutNumpad
            @input="(x) => insertNumber(x)"
            @backspace="() => backspaceNumber()"
         />
      </div>
   </Window>
</template>

<style lang="scss" scoped>
   .WindowCustomer {
      max-width: 100%;
      width: 35rem;

      .WindowCustomer-input {
         font-size: 1rem;
         border: none;
         background: hsla(0, 0%, 0%, 0.03);
         border-bottom: 1px solid hsl(0, 0%, 70%);
         border-radius: 0.2rem;
         padding: 0.6rem 0.4rem;
         margin-top: 2rem;
      }

      .WindowCustomer-phoneNumber {
         gap: 1rem;

         display: flex;
         flex-direction: row;
         align-items: flex-start;
         justify-content: center;
         flex-wrap: wrap;
      }
   }
</style>
