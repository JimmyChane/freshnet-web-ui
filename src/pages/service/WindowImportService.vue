<script>
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import TypeSelector from "@/components/selector/TypeSelector.vue";
   import ServiceStates from "@/objects/ServiceStates.js";
   import ModuleService from "@/items/data/Service.js";
   import LayoutFindCustomer from "./LayoutFindCustomer.vue";
   import BodyUser from "./WindowUpdateService-user.vue";
   import BodyCustomer from "./WindowUpdateService-customer.vue";
   import BodyDescription from "./WindowUpdateService-description.vue";
   import BodyBelongings from "./WindowUpdateService-belongings.vue";
   import BodyLine from "./WindowUpdateService-line.vue";

   export default {
      components: {
         PopupWindowAction,
         TypeSelector,
         ModuleService,
         LayoutFindCustomer,
         BodyUser,
         BodyCustomer,
         BodyDescription,
         BodyBelongings,
         BodyLine,
      },
      props: { isShowing: { type: Boolean, default: false } },
      data: (c) => ({
         ModuleService,
         ServiceStates,

         data: {
            nameOfUser: "",
            customer: { name: "", phoneNumber: "" },
            description: "",
            belongings: [],
         },
      }),
      computed: {
         user: (c) => c.loginStore.getters.user,
         nameUserType: (c) => {
            if (c.user.isTypeAdmin()) return "Admin";
            if (c.user.isTypeStaff()) return "Staff";
            return "unknowna";
         },
      },
      methods: {
         resetData() {
            this.data = {
               nameOfUser: "",
               customer: { name: "", phoneNumber: "" },
               description: "",
               belongings: [],
            };

            if (!this.state) {
               this.data.state = ModuleService.State.Pending;
            }

            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            now.setMilliseconds(null);
            now.setSeconds(null);
            this.$refs.DateTimeInput.value = now.toISOString().slice(0, -1);
         },
         trimData() {
            this.data.nameOfUser = this.data.nameOfUser.trim();
            this.data.customer.name = this.data.customer.name.trim();
            this.data.customer.phoneNumber = this.data.customer.phoneNumber.trim();
            this.data.description = this.data.description.trim();
            this.data.belongings = this.$refs.BelongingListEdit.getResults();
            this.data.time = Date.parse(this.$refs.DateTimeInput.value);

            return this.data;
         },

         onCancel() {
            this.$emit("click-cancel");
            this.resetData();
         },
         onOk() {
            this.data = this.trimData();

            if (Number.isNaN(this.data.time)) {
               this.store.dispatch("snackbarShow", "Date & Time Not Set");
               return;
            }

            if (!this.data.state) {
               this.store.dispatch("snackbarShow", "State Not Set");
               return;
            }

            this.serviceStore
               .dispatch("importItem", { data: this.data })
               .then((service) => {
                  this.$emit("click-ok", service);
                  this.resetData();
               })
               .catch((error) => {
                  this.store.dispatch("snackbarShow", "Failed to import a service");
                  console.error(error);
               });
         },

         clickCustomerSuggestion(customer) {
            this.data.customer.name = customer.name;
            this.data.customer.phoneNumber = customer.phoneNumber
               ? customer.phoneNumber.toString()
               : "";
         },
      },
      mounted() {
         this.resetData();
      },
   };
</script>

<template>
   <PopupWindowAction
      title="Import Service"
      :isShowing="isShowing"
      :isLoading="serviceStore.getters.isFetching"
      :isClickable="!serviceStore.getters.isFetching"
      @click-ok="onOk()"
      @click-cancel="onCancel()"
      @click-dismiss="() => $emit('click-dismiss')"
   >
      <div class="WindowService-body">
         <BodyUser
            :name="data.nameOfUser"
            @input-name="(value) => (data.nameOfUser = value)"
         />

         <div class="WindowService-datetime">
            <span class="WindowService-title">Creation Date & Time</span>
            <div class="WindowService-datetime-body">
               <input
                  class="WindowService-datetime-input"
                  ref="DateTimeInput"
                  type="datetime-local"
               />
            </div>
         </div>
         <BodyLine />

         <div class="WindowService-state">
            <span class="WindowService-title">States</span>
            <TypeSelector
               class="WindowEvent-type"
               :items="ServiceStates.list.map((state) => state)"
               :defaultKey="data.state"
               @click-item-key="(key) => (data.state = key)"
            />
         </div>
         <BodyLine />

         <BodyCustomer
            :name="data.customer.name"
            :phoneNumber="data.customer.phoneNumber"
            @input-name="(value) => (data.customer.name = value)"
            @input-phoneNumber="(value) => (data.customer.phoneNumber = value)"
         />
         <LayoutFindCustomer
            class="WindowService-findCustomers"
            :inputName="data.customer.name"
            :inputPhoneNumber="data.customer.phoneNumber"
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
      max-width: 100%;
      width: 35rem;
      display: flex;
      flex-direction: column;
      gap: 40px;

      // Abstract
      .WindowService-title {
         font-size: 1.1rem;
         font-weight: 600;
      }

      .WindowService-datetime {
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: flex-start;

         .WindowService-datetime-title {
            font-size: 0.9rem;
            font-weight: 400;
            color: hsl(0, 0%, 50%);
         }
         .WindowService-datetime-body {
            display: flex;
            flex-direction: column;
            .WindowService-datetime-input {
               border: 1px solid hsla(0, 0%, 0%, 0.1);
            }
         }
      }
      .WindowService-state {
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: flex-start;

         .WindowService-state-title {
            font-size: 0.9rem;
            font-weight: 400;
            color: hsl(0, 0%, 50%);
         }
         .WindowEvent-type {
            width: 100%;
         }
      }
      .WindowService-findCustomers {
         width: 100%;
         max-height: 20rem;
      }
   }
</style>
