<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import LayoutFindCustomer from "./LayoutFindCustomer.vue";
   import BodyUser from "./WindowUpdateService-user.vue";
   import BodyCustomer from "./WindowUpdateService-customer.vue";
   import BodyDescription from "./WindowUpdateService-description.vue";
   import BodyBelongings from "./WindowUpdateService-belongings.vue";
   import BodyLine from "./WindowUpdateService-line.vue";

   export default {
      components: {
         PopupWindowAction,
         LayoutFindCustomer,
         BodyUser,
         BodyCustomer,
         BodyDescription,
         BodyBelongings,
         BodyLine,
      },
      props: { isShowing: { type: Boolean, default: false } },
      data: (c) => ({
         nameOfUser: "unknown",
         data: {
            customerName: "",
            customerPhoneNumber: "",
            belongings: [],
            description: "",
         },
      }),
      computed: {
         user: (c) => c.loginStore.getters.user,
         userIsDefault: (c) => c.user.isDefault() || c.user.isDefault(),
      },
      watch: {
         user() {
            const user = this.user;
            if (!user.isTypeNone()) {
               this.nameOfUser = this.userIsDefault ? "" : user.name;
            }
         },
      },
      mounted() {
         this.onReset();
         this.onUser();
      },
      methods: {
         clickCustomerSuggestion(customer) {
            this.data.customerName = customer.name;
            this.data.customerPhoneNumber = customer.phoneNumber
               ? customer.phoneNumber.toString()
               : "";
         },

         onUser() {
            this.loginStore.dispatch("refresh");
         },
         onReset() {
            this.data = {
               customerName: "",
               customerPhoneNumber: "",
               belongings: [],
               description: "",
            };
         },
         onCreate() {
            const data = {
               customer: {
                  name: this.data.customerName.trim(),
                  phoneNumber: this.data.customerPhoneNumber.trim(),
               },
               description: this.data.description.trim(),
               belongings: this.$refs.BelongingListEdit.getResults(),
            };

            if (this.userIsDefault && !this.nameOfUser.trim()) {
               this.store.dispatch("snackbarShow", "You must specify your name");
            } else if (!data.customer.name) {
               this.store.dispatch("snackbarShow", "You must specify customer name");
            } else if (!data.description) {
               this.store.dispatch("snackbarShow", "You must specify description");
            } else {
               if (this.userIsDefault && this.nameOfUser.trim()) {
                  data.nameOfUser = this.nameOfUser;
               }

               this.$emit("callback-create", data);
               this.onReset();
               this.onUser();
            }
         },

         focus() {
            this.$refs.bodyCustomer.focus();
         },
      },
   };
</script>

<template>
   <PopupWindowAction
      title="Add Service"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
      @click-ok="onCreate()"
      @click-cancel="
         () => {
            $emit('callback-cancel');
            onUser();
            onReset();
         }
      "
      @click-dismiss="() => $emit('callback-dismiss')"
   >
      <div class="WindowService-body">
         <BodyUser :name="nameOfUser" @input-name="(value) => (nameOfUser = value)" />

         <BodyCustomer
            ref="bodyCustomer"
            :name="data.customerName"
            :phoneNumber="data.customerPhoneNumber"
            @input-name="(value) => (data.customerName = value)"
            @input-phoneNumber="(value) => (data.customerPhoneNumber = value)"
         />
         <LayoutFindCustomer
            class="WindowService-findCustomers"
            :inputName="data.customerName"
            :inputPhoneNumber="data.customerPhoneNumber"
            @click-item="(customer) => clickCustomerSuggestion(customer)"
         />
         <BodyLine />

         <BodyDescription
            :description="data.description"
            @input-description="(value) => (data.description = value)"
         />
         <BodyLine />

         <BodyBelongings :belongings="data.belongings" ref="BelongingListEdit" />
      </div>
   </PopupWindowAction>
</template>

<style lang="scss" scoped>
   .WindowService-body {
      width: 35rem;
      max-width: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;

      .WindowService-findCustomers {
         width: 100%;
         max-height: 20rem;
      }
   }
</style>
