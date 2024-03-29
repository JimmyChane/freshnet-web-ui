<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import LayoutFindCustomer from "./LayoutFindCustomer.vue";
   import BodyUser from "./WindowUpdateService-user.vue";
   import BodyCustomer from "./WindowUpdateService-customer.vue";
   import BodyDescription from "./WindowUpdateService-description.vue";
   import BodyBelongings from "./WindowUpdateService-belongings.vue";
   import BodyLine from "./WindowUpdateService-line.vue";

   export default {
      components: {
         PanelAction,
         LayoutFindCustomer,
         BodyUser,
         BodyCustomer,
         BodyDescription,
         BodyBelongings,
         BodyLine,
      },
      props: {
         popupWindow: { type: Object },
      },
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
         isShowing: (c) => c.popupWindow.isShowing,

         user: (c) => c.$store.state.stores.login.getters.user,
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
      methods: {
         clickCustomerSuggestion(customer) {
            this.data.customerName = customer.name;
            this.data.customerPhoneNumber = customer.phoneNumber
               ? customer.phoneNumber.toString()
               : "";
         },

         onUser() {
            this.$store.state.stores.login.dispatch("refresh");
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
               this.$store.dispatch(
                  "snackbarShow",
                  "You must specify your name",
               );
               return;
            }
            if (!data.customer.name) {
               this.$store.dispatch(
                  "snackbarShow",
                  "You must specify customer name",
               );
               return;
            }
            if (!data.description) {
               this.$store.dispatch(
                  "snackbarShow",
                  "You must specify description",
               );
               return;
            }
            if (this.userIsDefault && this.nameOfUser.trim()) {
               data.nameOfUser = this.nameOfUser;
            }

            const accept = () => {
               this.onReset();
               this.onUser();
               this.popupWindow.close();
            };
            const reject = () => {};
            this.popupWindow.onConfirm(accept, reject, data);
         },

         focus() {
            this.$refs.bodyCustomer.focus();
         },
      },
      mounted() {
         this.onReset();
         this.onUser();
         this.focus();
      },
   };
</script>

<template>
   <PanelAction
      title="Add Service"
      :isShowing="isShowing"
      :isLoading="$store.state.stores.service.getters.isFetching"
      :isClickable="!$store.state.stores.service.getters.isFetching"
      @click-ok="() => onCreate()"
      @click-cancel="
         () => {
            popupWindow.close();
            onUser();
            onReset();
         }
      "
      @click-dismiss="() => popupWindow.close()"
   >
      <div class="WindowService-body">
         <BodyUser
            :name="nameOfUser"
            @input-name="(value) => (nameOfUser = value)"
         />

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

         <BodyBelongings
            :belongings="data.belongings"
            ref="BelongingListEdit"
         />
      </div>
   </PanelAction>
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
