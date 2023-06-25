<script>
   import Loading from "@/components/Loading.vue";
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Input from "@/components/Input.vue";

   import WindowAddCustomer from "./WindowAddCustomer.vue";
   import WindowRemoveCustomer from "./WindowRemoveCustomer.vue";
   import WindowUpdateCustomer from "./WindowUpdateCustomer.vue";
   import WindowUpdateDescription from "./WindowUpdateDescription.vue";
   import WindowAddDevice from "./WindowAddDevice.vue";
   import WindowRemoveDevice from "./WindowRemoveDevice.vue";
   import WindowUpdateDeviceSpecifications from "./WindowUpdateDeviceSpecifications.vue";
   import WindowUpdateDeviceDescription from "./WindowUpdateDeviceDescription.vue";

   import PanelCustomers from "./PanelCustomers.vue";
   import PanelCustomer from "./PanelCustomer.vue";
   import PanelRight from "@/components/panel/PanelRight.vue";

   import HostIcon from "@/host/HostIcon";

   import PopupContext from "@/tools/PopupContext";

   export default {
      key: "customer",
      title: "Customers",
      icon: {
         light: new HostIcon("customers-FFFFFF.svg"),
         dark: new HostIcon("customers-000000.svg"),
      },

      userPermissions: ["admin", "staff"],

      components: {
         Loading,
         PopupWindow,
         Input,
         PanelCustomers,
         PanelCustomer,
         PanelRight,
      },
      data: (c) => ({
         panelListened: { isWide: false },
         items: [],
         drawerCustomer: null,

         windowAddCustomer: new PopupContext(c).onShow(() => {
            c.store.dispatch("openPopupWindow", {
               component: WindowAddCustomer,
            });
         }),
         windowRemoveCustomer: new PopupContext(c).onShow(
            (accept, reject, data) => {
               c.store.dispatch("openPopupWindow", {
                  component: WindowRemoveCustomer,
                  item: data?.item ?? null,
                  onConfirm: () => {
                     if (data.id === c.queryCustomerId) {
                        c.clickClose();
                     }
                  },
               });
            },
         ),
         windowUpdateCustomer: new PopupContext(c).onShow(
            (accept, reject, data) => {
               c.store.dispatch("openPopupWindow", {
                  component: WindowUpdateCustomer,
                  item: data?.item ?? null,
               });
            },
         ),
         windowUpdateDescription: new PopupContext(c).onShow(
            (accept, reject, data) => {
               c.store.dispatch("openPopupWindow", {
                  component: WindowUpdateDescription,
                  item: data?.item ?? null,
               });
            },
         ),
         windowAddDevice: new PopupContext(c).onShow((accept, reject, data) => {
            c.store.dispatch("openPopupWindow", {
               component: WindowAddDevice,
               item: data?.item ?? null,
            });
         }),
         windowRemoveDevice: new PopupContext(c).onShow(
            (accept, reject, data) => {
               c.store.dispatch("openPopupWindow", {
                  component: WindowRemoveDevice,
                  param: data
                     ? { customer: data.item, device: data.device }
                     : null,
               });
            },
         ),
         windowUpdateDeviceSpecifications: new PopupContext(c).onShow(
            (accept, reject, data) => {
               c.store.dispatch("openPopupWindow", {
                  component: WindowUpdateDeviceSpecifications,
                  param: data
                     ? {
                          customer: data.customer,
                          device: data.device,
                          specifications: data.specifications,
                       }
                     : null,
               });
            },
         ),
         windowUpdateDeviceDescription: new PopupContext(c).onShow(
            (accept, reject, data) => {
               c.store.dispatch("openPopupWindow", {
                  component: WindowUpdateDeviceDescription,
                  customer: data?.customer ?? null,
                  device: data?.device ?? null,
               });
            },
         ),
      }),
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,

         queryId: (c) => c.$route.query.id,
         queryName: (c) => c.$route.query.name,
         queryPhoneNumber: (c) => c.$route.query.phoneNumber,

         currentCustomer: (c) => {
            if (!c.items.length) return null;

            const { queryId, queryName, queryPhoneNumber } = c;

            const isSearchById = !!queryId;

            let customer = null;

            if (isSearchById) {
               customer = c.items.find((customer) => customer.id === queryId);
            } else {
               customer = c.items.find((customer) => {
                  const phoneNumberValue = customer.phoneNumber?.value ?? "";
                  return (
                     customer.name === queryName &&
                     phoneNumberValue === queryPhoneNumber
                  );
               });
            }

            if (!isSearchById && (customer?.isFromStoreCustomer() ?? false)) {
               c.$root.replaceQuery({
                  query: {
                     id: customer.id,
                     name: null,
                     phoneNumber: null,
                  },
               });
            }

            return customer;
         },
      },
      watch: {
         "customerStore.getters.items"() {
            this.invalidate();
         },
         currentCustomer() {
            if (!this.currentCustomer) {
               setTimeout(
                  () => (this.drawerCustomer = this.currentCustomer),
                  1000,
               );
            } else {
               this.drawerCustomer = this.currentCustomer;
            }
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.items = [];
            this.items = await this.customerStore.dispatch(
               "generateCustomersAcross",
            );
         },

         clickRefresh() {
            this.customerStore.dispatch("refresh");
            this.invalidate();
         },
         clickClose() {
            this.$root.nextQuery({
               query: { id: null, name: null, phoneNumber: null },
            });
         },
         clickItemAdd() {
            this.windowAction("windowAddCustomer", "start");
         },
         clickItemRemove(item) {
            this.windowAction("windowRemoveCustomer", "start", { item });
         },

         windowAction(window, action, data) {
            const self = this[window];

            if (self instanceof PopupContext) {
               switch (action) {
                  case "start":
                     self.show(data);
                     break;
                  case "dismiss":
                     self.dismiss();
                     break;
                  case "cancel":
                     self.cancel();
                     break;
                  case "ok":
                     self.confirm(data);
                     break;
               }
               return;
            }

            self[action](this, self, data);
         },
      },
   };
</script>

<template>
   <div class="PageCustomer">
      <div class="PageCustomer-body" :isPanelWide="`${panelListened.isWide}`">
         <PanelCustomers
            class="PageCustomer-panelLeft transition"
            :items="items"
            :itemSelected="currentCustomer"
            :title="$options.title"
            @click-refresh="() => invalidate()"
            @click-item-add="() => clickItemAdd()"
            @click-item-remove="(param) => clickItemRemove(param.item)"
         />

         <PanelRight
            class="PageCustomer-PanelRight"
            titleEmpty="Select customer to view"
            :isShowing="!!currentCustomer"
            @click-collapse="() => clickClose()"
            @on-isWide="(isWide) => (panelListened.isWide = isWide)"
         >
            <PanelCustomer
               class="PageCustomer-PanelCustomer transition"
               :item="drawerCustomer"
               @click-item-close="() => clickClose()"
               @click-item-remove="(param) => this.clickItemRemove(param.item)"
               @click-item-customer-update="
                  (param) =>
                     windowAction('windowUpdateCustomer', 'start', param)
               "
               @click-item-description-update="
                  (param) =>
                     windowAction('windowUpdateDescription', 'start', param)
               "
               @click-item-device-add="
                  (param) => windowAction('windowAddDevice', 'start', param)
               "
               @click-item-device-remove="
                  (param) => windowAction('windowRemoveDevice', 'start', param)
               "
               @click-item-device-update-specifications="
                  (param) =>
                     windowAction(
                        'windowUpdateDeviceSpecifications',
                        'start',
                        param,
                     )
               "
               @click-item-device-update-description="
                  (param) =>
                     windowAction(
                        'windowUpdateDeviceDescription',
                        'start',
                        param,
                     )
               "
            />
         </PanelRight>
      </div>

      <Loading class="PageCustomer-loading" :isShowing="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   .PageCustomer {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .PageCustomer-top {
         flex-grow: 0;
      }

      .PageCustomer-body {
         flex-grow: 1;
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: row;
         position: relative;
         .PageCustomer-panelLeft {
            z-index: 1;
            height: 100%;
         }
         .PageCustomer-PanelRight {
            z-index: 2;
         }
      }
      .PageCustomer-body[isPanelWide="false"] {
         .PageCustomer-panelLeft {
            width: 100dvw;
            max-width: 100%;
         }
      }
      .PageCustomer-body[isPanelWide="true"] {
         .PageCustomer-panelLeft {
            width: 100dvw;
            max-width: 50%;
         }
      }

      .PageCustomer-loading {
         position: absolute;
         bottom: 0;
         width: 100%;
         z-index: 1;
      }

      .PageCustomer-window {
         z-index: 4;
         max-width: 100%;
         height: 100%;
      }
   }
</style>
