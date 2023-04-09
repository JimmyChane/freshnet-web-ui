<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import PanelItemCustomer from "@/pages/manage/PanelItem-Customer.vue";

   export default {
      components: { Actionbar, PanelItemCustomer },
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
                  icon: c.host.icon("call-color"),
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
         <PanelItemCustomer
            v-if="customer"
            :customer="customer"
            @click-edit="(customer) => actions.onClickUpdateCustomer(customer)"
         />
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
