<script>
   import Drawer from "@/components/Drawer.vue";
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

   import HostIcon from "@/host/HostIcon";

   export default {
      key: "customer",
      title: "Customers",
      icon: {
         light: new HostIcon("customers-FFFFFF.svg"),
         dark: new HostIcon("customers-000000.svg"),
      },

      userPermissions: ["admin", "staff"],

      components: {
         Drawer,
         Loading,
         PopupWindow,
         Input,
         PanelCustomers,
         PanelCustomer,
         WindowAddCustomer,
         WindowRemoveCustomer,
         WindowUpdateCustomer,
         WindowUpdateDescription,
         WindowAddDevice,
         WindowRemoveDevice,
         WindowUpdateDeviceSpecifications,
         WindowUpdateDeviceDescription,
      },
      emits: ["callback-side-expand"],
      data() {
         return {
            windowAddCustomer: {
               isShowing: false,
               start: (context, self, data) => (self.isShowing = true),
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => (self.isShowing = false),
               ok: (context, self, data) => (self.isShowing = false),
            },
            windowRemoveCustomer: {
               isShowing: false,
               item: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.item = data.item;
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => (self.isShowing = false),
               ok: (context, self, data) => {
                  self.isShowing = false;
                  if (data.id === context.queryCustomerId) context.clickClose();
               },
            },
            windowUpdateCustomer: {
               isShowing: false,
               item: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.item = data.item;
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => (self.isShowing = false),
               ok: (context, self, data) => (self.isShowing = false),
            },
            windowUpdateDescription: {
               isShowing: false,
               item: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.item = data.item;
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => (self.isShowing = false),
               ok: (context, self, data) => (self.isShowing = false),
            },
            windowAddDevice: {
               isShowing: false,
               item: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.item = data.item;
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => (self.isShowing = false),
               ok: (context, self, data) => (self.isShowing = false),
            },
            windowRemoveDevice: {
               isShowing: false,
               param: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.param = { customer: data.item, device: data.device };
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => (self.isShowing = false),
               ok: (context, self, data) => (self.isShowing = false),
            },
            windowUpdateDeviceSpecifications: {
               isShowing: false,
               param: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.param = {
                     customer: data.customer,
                     device: data.device,
                     specifications: data.specifications,
                  };
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => {
                  self.isShowing = false;
                  self.param = null;
               },
               ok: (context, self, data) => {
                  self.isShowing = false;
                  self.param = null;
               },
            },
            windowUpdateDeviceDescription: {
               isShowing: false,
               customer: null,
               device: null,
               start: (context, self, data) => {
                  self.isShowing = true;
                  self.customer = data.customer;
                  self.device = data.device;
               },
               dismiss: (context, self, data) => (self.isShowing = false),
               cancel: (context, self, data) => {
                  self.isShowing = false;
                  self.customer = null;
                  self.device = null;
               },
               ok: (context, self, data) => {
                  self.isShowing = false;
                  self.customer = null;
                  self.device = null;
               },
            },

            drawerCustomer: null,

            items: [],
         };
      },
      computed: {
         isLoading: (c) => c.customerStore.getters.isLoading,
         isOver1200px: (c) => c.$root.window.innerWidth > 1200,

         itemDrawerEdge: () => Drawer.Edge.RIGHT,
         itemDrawerMode() {
            if (this.isOver1200px) {
               return this.currentCustomer
                  ? Drawer.Mode.FIXED_EXPAND
                  : Drawer.Mode.FIXED_COLLAPSE;
            } else {
               return this.currentCustomer
                  ? Drawer.Mode.DRAWER_EXPAND
                  : Drawer.Mode.DRAWER_COLLAPSE;
            }
         },

         queryName: (c) => c.$route.query.name,
         queryPhoneNumber: (c) => c.$route.query.phoneNumber,

         currentCustomer() {
            if (!this.items.length) return null;

            const { queryName, queryPhoneNumber } = this;

            const customer = this.items.find((customer) => {
               const { phoneNumber } = customer;
               const phoneNumberValue = phoneNumber ? phoneNumber.value : "";

               const isNameSame = customer.name === queryName;
               const isPhoneNumerSame = phoneNumberValue === queryPhoneNumber;
               return isNameSame && isPhoneNumerSame;
            });

            return customer ? customer : null;
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
            this.$root.nextRoute({ query: { name: null, phoneNumber: null } });
         },
         clickItemAdd() {
            this.windowAction("windowAddCustomer", "start");
         },
         clickItemRemove(item) {
            this.windowAction("windowRemoveCustomer", "start", { item });
         },

         windowAction(window, action, data) {
            const self = this[window];
            self[action](this, self, data);
         },
      },
   };
</script>

<template>
   <div class="PageCustomer">
      <div
         :class="[
            'PageCustomer-body',
            `PageCustomer-body-${
               isOver1200px ? 'isOver1200px' : 'isLess1200px'
            }`,
         ]"
      >
         <PanelCustomers
            class="PageCustomer-panelLeft transition"
            :items="items"
            :itemSelected="currentCustomer"
            :title="$options.title"
            @click-drawer-expand="() => $emit('click-drawer-expand')"
            @click-refresh="() => invalidate()"
            @click-item-add="() => clickItemAdd()"
            @click-item-remove="(param) => clickItemRemove(param.item)"
         />

         <div class="PageCustomer-PanelRightEmpty">
            <span class="PageCustomer-PanelRightEmpty-text"
               >Select to view</span
            >
         </div>

         <Drawer
            class="PageCustomer-RightDrawer"
            :edge="itemDrawerEdge"
            :mode="itemDrawerMode"
            @click-collapse="() => clickClose()"
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
         </Drawer>
      </div>

      <Loading class="PageCustomer-loading" :isShowing="isLoading" />

      <!-- Add Customer -->
      <WindowAddCustomer
         class="PageCustomer-window"
         :isShowing="windowAddCustomer.isShowing"
         @click-dismiss="() => windowAction('windowAddCustomer', 'dismiss')"
         @click-cancel="() => windowAction('windowAddCustomer', 'cancel')"
         @click-ok="(param) => windowAction('windowAddCustomer', 'ok', param)"
      />

      <!-- Remove Customer -->
      <WindowRemoveCustomer
         class="PageCustomer-window"
         :isShowing="windowRemoveCustomer.isShowing"
         :item="windowRemoveCustomer.item"
         @click-dismiss="() => windowAction('windowRemoveCustomer', 'dismiss')"
         @click-cancel="() => windowAction('windowRemoveCustomer', 'cancel')"
         @click-ok="(item) => windowAction('windowRemoveCustomer', 'ok', item)"
      />

      <!-- Update Customer -->
      <WindowUpdateCustomer
         class="PageCustomer-window"
         :isShowing="windowUpdateCustomer.isShowing"
         :item="windowUpdateCustomer.item"
         @click-dismiss="() => windowAction('windowUpdateCustomer', 'dismiss')"
         @click-cancel="() => windowAction('windowUpdateCustomer', 'cancel')"
         @click-ok="() => windowAction('windowUpdateCustomer', 'ok')"
      />

      <!-- Update Description -->
      <WindowUpdateDescription
         class="PageCustomer-window"
         :isShowing="windowUpdateDescription.isShowing"
         :item="windowUpdateDescription.item"
         @click-dismiss="
            () => windowAction('windowUpdateDescription', 'dismiss')
         "
         @click-cancel="() => windowAction('windowUpdateDescription', 'cancel')"
         @click-ok="() => windowAction('windowUpdateDescription', 'ok')"
      />

      <!-- Add Device -->
      <WindowAddDevice
         class="PageCustomer-window"
         :isShowing="windowAddDevice.isShowing"
         :item="windowAddDevice.item"
         @click-dismiss="() => windowAction('windowAddDevice', 'dismiss')"
         @click-cancel="() => windowAction('windowAddDevice', 'cancel')"
         @click-ok="() => windowAction('windowAddDevice', 'ok')"
      />

      <!-- Remove Device -->
      <WindowRemoveDevice
         class="PageCustomer-window"
         :isShowing="windowRemoveDevice.isShowing"
         :param="windowRemoveDevice.param"
         @click-dismiss="() => windowAction('windowRemoveDevice', 'dismiss')"
         @click-cancel="() => windowAction('windowRemoveDevice', 'cancel')"
         @click-ok="() => windowAction('windowRemoveDevice', 'ok')"
      />

      <!-- Update Specifications Device -->
      <WindowUpdateDeviceSpecifications
         class="PageCustomer-window"
         :isShowing="windowUpdateDeviceSpecifications.isShowing"
         :param="windowUpdateDeviceSpecifications.param"
         @click-dismiss="
            () => windowAction('windowUpdateDeviceSpecifications', 'dismiss')
         "
         @click-cancel="
            () => windowAction('windowUpdateDeviceSpecifications', 'cancel')
         "
         @click-ok="
            () => windowAction('windowUpdateDeviceSpecifications', 'ok')
         "
      />

      <!-- Update Description -->
      <WindowUpdateDeviceDescription
         class="PageCustomer-window"
         :isShowing="windowUpdateDeviceDescription.isShowing"
         :customer="windowUpdateDeviceDescription.customer"
         :device="windowUpdateDeviceDescription.device"
         @click-dismiss="
            () => windowAction('windowUpdateDeviceDescription', 'dismiss')
         "
         @click-cancel="
            () => windowAction('windowUpdateDeviceDescription', 'cancel')
         "
         @click-ok="() => windowAction('windowUpdateDeviceDescription', 'ok')"
      />
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
         .PageCustomer-PanelRightEmpty {
            z-index: 2;
            background-color: #adb8bb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            .PageCustomer-PanelRightEmpty-text {
               font-weight: 600;
               font-size: 1.2rem;
               color: hsl(0, 0%, 84%);
               background: hsla(0, 0%, 0%, 0.04);
               border-radius: 1rem;
               padding: 4rem 5rem;
            }
         }
         .PageCustomer-RightDrawer {
            z-index: 3;
            .PageCustomer-PanelCustomer {
               flex-grow: 1;
               height: 100%;
               box-shadow: 0px 0px 20px rgba(42, 72, 88, 0.25);
               overflow-y: auto;

               height: 100%;
               width: 100vw;
               max-width: 100%;
            }
         }
      }

      .PageCustomer-body-isLess1200px {
         .PageCustomer-panelLeft {
            width: 100vw;
            max-width: 100%;
         }
         .PageCustomer-PanelRightEmpty {
            display: none;
         }
         .PageCustomer-RightDrawer {
            width: 100vw;
            max-width: 100%;
         }
      }
      .PageCustomer-body-isOver1200px {
         .PageCustomer-panelLeft {
            width: 100vw;
            max-width: 50%;
         }
         .PageCustomer-PanelRightEmpty {
            width: 100vw;
            max-width: 50%;
         }
         .PageCustomer-RightDrawer {
            width: 100vw;
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
