<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import WindowSection from "./WindowSection.vue";
   import Customer from "@/items/Customer";

   export default {
      components: { PanelAction, WindowSection },
      emits: ["click-dismiss", "click-cancel", "click-ok"],
      props: {
         popupWindow: { type: Object },
      },
      data: (c) => ({ Requirement: Customer.Requirement }),
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
         item: (c) => c.popupWindow.item,
         isLoading: (c) => c.$store.state.stores.customer.getters.isLoading,
         isClickable: (c) => !c.$store.state.stores.customer.getters.isLoading,
      },
      methods: {
         clickOk() {
            this.$store.state.stores.customer
               .dispatch("removeItemOfId", { _id: this.item.id })
               .then((item) => this.popupWindow.close());
         },
      },
   };
</script>

<template>
   <PanelAction
      class="WindowRemoveCustomer"
      title="Remove Customer?"
      :isShowing="isShowing"
      :isLoading="isLoading"
      :isClickable="isClickable"
      @click-dismiss="() => popupWindow.close()"
      @click-cancel="() => popupWindow.close()"
      @click-ok="() => clickOk()"
   >
      <div class="WindowRemoveCustomer-body" v-if="item">
         <p>Services and Orders might not effected</p>

         <div class="WindowRemoveCustomer-namePhoneNumber">
            <div
               class="WindowRemoveCustomer-namePhoneNumber-section"
               v-if="item.name"
            >
               <span class="WindowRemoveCustomer-namePhoneNumber-section-header"
                  >Name</span
               >
               <span
                  class="WindowRemoveCustomer-namePhoneNumber-section-content"
                  >{{ item.name }}</span
               >
            </div>

            <div
               class="WindowRemoveCustomer-namePhoneNumber-section"
               v-if="item.phoneNumber"
            >
               <span class="WindowRemoveCustomer-namePhoneNumber-section-header"
                  >Phone Number</span
               >
               <span
                  class="WindowRemoveCustomer-namePhoneNumber-section-content"
                  >{{ item.phoneNumber }}</span
               >
            </div>
         </div>

         <div class="WindowRemoveCustomer-description" v-if="item.description">
            <span class="WindowRemoveCustomer-description-header"
               >Description</span
            >
            <span class="WindowRemoveCustomer-description-body">{{
               item.description
            }}</span>
         </div>
      </div>
   </PanelAction>
</template>

<style lang="scss" scoped>
   .WindowRemoveCustomer-reuse-input {
      font-size: 1rem;
      border: none;
      background: hsla(0, 0%, 0%, 0.03);
      border-bottom: 1px solid hsl(0, 0%, 70%);
      border-radius: 0.2rem;
      padding: 0.2rem 0.4rem;
   }

   .WindowRemoveCustomer {
      width: 100%;
      height: 100%;
      .WindowRemoveCustomer-body {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         gap: 0.5rem;

         .WindowRemoveCustomer-namePhoneNumber {
            background: hsla(201, 35%, 25%, 0.02);
            border: 1px solid hsla(201, 35%, 25%, 0.05);
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            column-gap: 2rem;
            row-gap: 0.3rem;

            .WindowRemoveCustomer-namePhoneNumber-section {
               flex-grow: 0;
               width: 100%;
               display: flex;
               flex-direction: row;
               align-items: flex-start;
               line-height: 1.2;
               .WindowRemoveCustomer-namePhoneNumber-section-header {
                  min-width: 8rem;
                  min-height: 2.5rem;
                  word-break: break-all;
                  text-overflow: clip;
                  overflow-x: hidden;

                  font-weight: 600;
                  font-size: 0.8rem;
                  display: flex;
                  flex-direction: row;
                  align-items: center;

                  flex-grow: 0;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
               }
               .WindowRemoveCustomer-namePhoneNumber-section-content {
                  min-height: 2.5rem;
                  flex-grow: 1;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
               }
            }
         }
         .WindowRemoveCustomer-description {
            background: hsla(201, 35%, 25%, 0.02);
            border: 1px solid hsla(201, 35%, 25%, 0.05);
            padding: 0.5rem;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            row-gap: 0.5rem;
            .WindowRemoveCustomer-description-header {
               min-height: 2.5rem;
               flex-grow: 1;
               padding: 0.5rem;
               font-weight: 600;
               font-size: 0.8rem;

               display: flex;
               flex-direction: row;
               align-items: center;
            }
            .WindowRemoveCustomer-description-body {
               padding: 0.5rem;
               flex-grow: 1;
               display: flex;
               flex-direction: column;
            }
         }
      }
   }
</style>
