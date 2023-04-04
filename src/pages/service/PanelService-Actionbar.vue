<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   export default {
      components: { Actionbar, ButtonIcon },
      props: {
         service: { type: Object },
         actionbarColor: "",
         actionbarBorder: "",
         actions: { type: Object },
      },
      computed: {
         customer: (c) => c.service.customer,
         name: (c) => c.customer.name,
         phoneNumber: (c) => c.customer.phoneNumber,
         phoneNumberStr: (c) => (c.phoneNumber ? c.phoneNumber.toString() : ""),
         isPhoneNumber: (c) => !!c.phoneNumberStr,

         menus: (c) => {
            const menus = [];

            if (c.isPhoneNumber) {
               menus.push({
                  title: "Chat with Customer on Whatsapp",
                  icon: c.host.icon("whatsapp-color"),
                  alth: "Chat on Whatsapp",
                  href: `https://api.whatsapp.com/send?phone=6${c.phoneNumberStr}`,
                  target: "_blank",
               });
               menus.push({
                  title: "Call Customer",
                  icon: c.host.icon("call-000000"),
                  href: `tel:+6${c.phoneNumberStr}`,
               });
            }
            menus.push({
               title: "Find Customer",
               to: {
                  path: "/manage/customer",
                  query: { name: c.name, phoneNumber: c.phoneNumberStr },
               },
               isHidden: true,
            });

            menus.push({
               title: "Delete Service",
               icon: c.host.icon("trash-000000"),
               click: () => c.actions.onClickRemove(c.service),
               isHidden: true,
            });

            return menus;
         },
      },
   };
</script>

<template>
   <div
      class="PanelService-actionbar"
      :style="{
         'background-color': actionbarColor,
         'border-bottom': `1px solid ${actionbarBorder}`,
      }"
   >
      <Actionbar
         v-if="service"
         class="PanelService-actionbar-main"
         :leftMenus="{
            icon: host.icon('close-000000'),
            click: () => actions.onClickClose(),
         }"
         :rightMenus="menus"
      >
         <div class="PanelService-actionbar-customer" v-if="customer">
            <div class="PanelService-actionbar-customer-data">
               <span
                  class="PanelService-actionbar-customer-name"
                  v-if="name.length"
                  >{{ name }}</span
               >
               <span
                  class="PanelService-actionbar-customer-phoneNumber"
                  v-if="phoneNumberStr.length"
                  >{{ phoneNumberStr }}</span
               >
            </div>

            <ButtonIcon
               class="PanelService-actionbar-customer-edit"
               :src="host.icon('edit-505050')"
               @click="() => actions.onClickUpdateCustomer(customer)"
            />
         </div>
      </Actionbar>

      <span class="PanelService-actionbar-timestamp" v-if="service">{{
         service.timestamp
      }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .PanelService-actionbar {
      --actionbar-background-color-translucent: white;

      width: 100%;
      position: sticky;
      top: 0;

      .PanelService-actionbar-main {
         background-color: inherit;
         border-bottom: inherit;
         .PanelService-actionbar-customer {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 0.5rem;

            .PanelService-actionbar-customer-data {
               display: flex;
               flex-direction: column;
               align-items: flex-start;
               justify-content: center;
               line-height: 1rem;

               .PanelService-actionbar-customer-name {
                  font-weight: 500;
               }
               .PanelService-actionbar-customer-phoneNumber {
                  font-size: 0.8em;
               }
            }
            .PanelService-actionbar-customer-edit {
               font-size: 0.8rem;
            }
         }
      }

      .PanelService-actionbar-timestamp {
         width: 100%;
         padding: 0.2rem;

         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;

         text-align: center;
         color: black;
         font-size: 0.8rem;
      }
   }
</style>
