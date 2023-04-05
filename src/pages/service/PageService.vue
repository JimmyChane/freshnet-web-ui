<script>
   import Loading from "@/components/Loading.vue";
   import WindowRemove from "@/components/window/WindowRemove.vue";
   import PanelServices from "./PanelServices.vue";
   import PanelService from "./PanelService.vue";
   import WindowSearch from "./WindowSearch.vue";
   import WindowImportService from "./WindowImportService.vue";
   import WindowAddService from "./WindowAddService.vue";
   import WindowUpdateDescription from "./WindowUpdateDescription.vue";
   import WindowUpdateBelonging from "./WindowUpdateBelonging.vue";
   import WindowUpdateCustomer from "./WindowUpdateCustomer.vue";
   import Drawer from "@/components/Drawer.vue";

   import HostIcon from "@/host/HostIcon";

   import PopupContext from "@/tools/PopupContext";

   export default {
      key: "service",
      title: "Services",
      icon: {
         light: new HostIcon("service-FFFFFF.svg"),
         dark: new HostIcon("service-000000.svg"),
      },
      userPermissions: ["admin", "staff"],

      components: {
         PanelServices,
         Loading,
         PanelService,
         WindowSearch,
         WindowImportService,
         WindowAddService,
         WindowUpdateCustomer,
         WindowUpdateDescription,
         WindowUpdateBelonging,
         WindowRemove,
         Drawer,
      },
      emits: ["callback-side-expand"],
      data: (c) => ({
         actions: {
            onClickClose: () => c.clickService(null),
            onClickRemove: (x) => c.clickDeleteService(x),
            onClickToAddEvent: (event) => {
               c.serviceStore
                  .dispatch("addEventToId", {
                     serviceID: c.currentService.id,
                     data: event,
                  })
                  .catch((error) => {
                     c.store.dispatch(
                        "snackbarShow",
                        "Failed to create an event",
                     );
                     throw error;
                  });
            },
            onClickRemoveEvent: (x) => c.clickRemoveEvent(x),
            onClickRemoveImage: (x) => c.clickRemoveImage(x),
            onClickUpdateCustomer: (x) => c.clickUpdateCustomer(x),
            onClickUpdateDescription: (x) => c.clickUpdateDescription(x),
            onClickUpdateBelongings: (x) => c.clickUpdateBelongings(x),
         },

         popup: {
            search: new PopupContext(c),
            importService: new PopupContext(c).onConfirm(
               (accept, reject, data) => {
                  accept();
                  c.clickService(data);
               },
            ),
            newService: new PopupContext(c)
               .onShow((accept, reject) => {
                  c.$refs.WindowAddService.focus();
                  accept();
               })
               .onConfirm(async (accept, reject, data) => {
                  try {
                     const result = await c.serviceStore.dispatch("addItem", {
                        data,
                     });

                     result ? accept() : reject();
                     c.clickService(result);
                  } catch (error) {
                     c.store.dispatch(
                        "snackbarShow",
                        "Failed to create a service",
                     );
                     reject();
                     throw error;
                  }
               }),
            removeService: new PopupContext(c).onConfirm(
               async (accept, reject, data) => {
                  try {
                     await c.serviceStore.dispatch("removeItemOfId", {
                        id: data.id,
                     });
                     accept();
                     if (c.currentServiceId === data.id) {
                        c.$root.replaceRoute({ query: { service: null } });
                     }
                  } catch (error) {
                     c.store.dispatch("snackbarShow", "Delete Failed");
                     reject();
                     throw error;
                  }
               },
            ),
            removeEvent: new PopupContext(c).onShow(
               async (accept, reject, data) => {
                  await c.serviceStore.dispatch("removeEventFromId", {
                     serviceID: data.service.id,
                     time: data.event.timestamp.time,
                  });
                  accept();
               },
            ),
            customer: new PopupContext(c)
               .onShow((accept, reject, data) => {
                  accept();
                  c.$refs.WindowUpdateCustomer.focus();
               })
               .onConfirm(async (accept, reject, data) => {
                  try {
                     const service = await c.serviceStore.dispatch(
                        "updateCustomerOfId",
                        {
                           serviceID: c.currentService.id,
                           customer: data,
                        },
                     );
                     accept();
                  } catch (error) {
                     c.store.dispatch("snackbarShow", "Update Customer Failed");
                     reject();
                     throw error;
                  }
               }),
            removeImage: new PopupContext(c).onConfirm(
               async (accept, reject, data) => {
                  try {
                     const service = await c.serviceStore.dispatch(
                        "removeImageFromId",
                        {
                           serviceID: c.currentService.id,
                           image: data,
                        },
                     );
                     c.store.dispatch("imageViewerHide");
                     accept();
                  } catch (error) {
                     c.store.dispatch("snackbarShow", "Delete Image Failed");
                     reject();
                     throw error;
                  }
               },
            ),
            editDescription: new PopupContext(c)
               .onShow((accept, reject, data) => {
                  accept();
                  c.$refs.WindowUpdateDescription.focus();
               })
               .onConfirm(async (accept, reject, data) => {
                  try {
                     const service = await c.serviceStore.dispatch(
                        "updateDescriptionOfId",
                        {
                           serviceID: c.currentService.id,
                           description: data,
                        },
                     );
                     accept();
                  } catch (error) {
                     c.store.dispatch(
                        "snackbarShow",
                        "Update Description Failed",
                     );
                     reject();
                     throw error;
                  }
               }),
            belongings: new PopupContext(c)
               .onShow((accept, reject, data) => {
                  accept();
                  c.$refs.WindowUpdateBelonging.focus();
               })
               .onConfirm(async (accept, reject, data) => {
                  try {
                     const service = await c.serviceStore.dispatch(
                        "updateBelongingsOfId",
                        {
                           serviceID: c.currentService.id,
                           belongings: data,
                        },
                     );
                     accept();
                  } catch (error) {
                     c.store.dispatch(
                        "snackbarShow",
                        "Update Belongings Failed",
                     );
                     reject();
                     throw error;
                  }
               }),
         },

         items: [],
         searchResults: [],

         currentService: null,
         drawerService: null,
      }),
      computed: {
         itemDrawerEdge: () => Drawer.Edge.RIGHT,
         itemDrawerMode() {
            if (this.isWide) {
               return this.currentService
                  ? Drawer.Mode.FIXED_EXPAND
                  : Drawer.Mode.FIXED_COLLAPSE;
            } else {
               return this.currentService
                  ? Drawer.Mode.DRAWER_EXPAND
                  : Drawer.Mode.DRAWER_COLLAPSE;
            }
         },

         isWide: (c) => c.$root.window.innerWidth > 1200,

         actionMenus: (c) => {
            return [
               {
                  key: "refresh",
                  title: "Refresh",
                  icon: c.host.icon("refresh-000000"),
                  click: () => c.clickRefresh(),
               },
            ];
         },

         currentUser: (c) => c.loginStore.getters.user,

         lastModified: (c) => c.serviceStore.getters.lastModified,
         currentServiceId: (c) => c.$route.query.service,
      },
      watch: {
         lastModified() {
            this.invalidate();
         },
         currentServiceId() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
         this.serviceStore.dispatch("refresh");
      },
      methods: {
         async invalidate() {
            const items = await this.serviceStore.dispatch("getItems");
            for (const item of items) {
               item.events.sort((event1, event2) => event1.compare(event2));
            }
            items.sort((item1, item2) => item1.compare(item2));

            this.items = items;

            await this.loginStore.dispatch("refresh");
            await this.invalidateServiceId();
         },
         async invalidateServiceId() {
            this.currentService = null;

            if (!this.currentServiceId) {
               return;
            }

            const service = await this.serviceStore.dispatch(
               "getItemOfId",
               this.currentServiceId,
            );

            if (this.currentServiceId === service.id) {
               this.updateServiceUI(service);
            }
         },

         updateServiceUI(service) {
            const hasNextService = !!service;

            this.currentService = service ? service : null;
            if (hasNextService) {
               this.drawerService = service;
            } else {
               setTimeout(() => (this.drawerService = service), 700);
            }
         },

         clickRefresh() {
            this.serviceStore.dispatch("refresh");
         },
         clickAddService() {
            this.windowAction("newService", "start");
         },
         clickImportService() {
            this.windowAction("importService", "start");
         },
         clickDeleteService(service) {
            this.windowAction("removeService", "start", service);
         },
         clickService(service) {
            service = service ? service : null;

            const hasPreviousSerivce = !!this.currentService;
            const hasNextService = !!service;
            const query = { service: service ? service.id : null };

            if (hasPreviousSerivce && hasNextService) {
               this.$root.replaceRoute({ query });
            } else {
               this.$root.nextRoute({ query });
            }

            this.updateServiceUI(service);
         },
         clickRemoveEvent(event) {
            this.windowAction("removeEvent", "start", event);
         },
         clickUpdateCustomer(customer) {
            this.windowAction("customer", "start", customer);
         },
         clickUpdateDescription(description) {
            this.windowAction("editDescription", "start", description);
         },
         clickUpdateBelongings(belongings) {
            this.windowAction("belongings", "start", belongings);
         },
         clickRemoveImage(image) {
            this.windowAction("removeImage", "start", image);
         },

         windowAction(window, action, data) {
            const self = this.popup[window];

            if (self instanceof PopupContext) {
               switch (action) {
                  case "start":
                     self.show(data);
                     break;
                  case "dismiss":
                     self.dismiss();
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
   <div class="PageService">
      <div class="PageService-panels" :isWide="`${isWide}`">
         <PanelServices
            class="PageService-PanelServices"
            :menus="actionMenus"
            :services="items"
            :currentItem="currentService"
            @click-service="(item) => clickService(item)"
            @click-search="() => windowAction('search', 'start')"
            @click-add="() => clickAddService()"
            @click-import="() => clickImportService()"
         />

         <div class="PageService-PanelRightEmpty">
            <span class="PageService-PanelRightEmpty-text"
               >Select service to view</span
            >
         </div>

         <Drawer
            class="PageService-RightDrawer"
            :edge="itemDrawerEdge"
            :mode="itemDrawerMode"
            :isExpand="!!currentService"
            :isDrawer="!isWide || !!drawerService"
            @click-collapse="$root.nextRoute({ query: { service: null } })"
         >
            <PanelService
               class="PageService-PanelRight"
               :service="drawerService"
               :actions="actions"
            />
         </Drawer>
      </div>

      <WindowSearch
         class="PageService-window"
         v-if="$root.window.innerWidth <= 600"
         :isShowing="popup.search.isShowing"
         :items="items"
         @click-dismiss="() => windowAction('search', 'dismiss')"
         @click-item="(item) => clickService(item)"
      />

      <WindowImportService
         class="PageService-window"
         :isShowing="popup.importService.isShowing"
         @click-cancel="() => windowAction('importService', 'dismiss')"
         @click-ok="(service) => windowAction('importService', 'ok', service)"
         @click-dismiss="() => windowAction('importService', 'dismiss')"
      />

      <WindowAddService
         class="PageService-window"
         ref="WindowAddService"
         :isShowing="popup.newService.isShowing"
         @callback-create="(data) => windowAction('newService', 'ok', data)"
         @callback-cancel="() => windowAction('newService', 'dismiss')"
         @callback-dismiss="() => windowAction('newService', 'dismiss')"
      />

      <WindowUpdateCustomer
         class="PageService-window"
         ref="WindowUpdateCustomer"
         v-if="drawerService"
         :isShowing="popup.customer.isShowing"
         :value="popup.customer.input"
         @callback-change="
            (customer) => windowAction('customer', 'ok', customer)
         "
         @callback-cancel="() => windowAction('customer', 'dismiss')"
         @callback-dismiss="() => windowAction('customer', 'dismiss')"
      />

      <WindowUpdateDescription
         class="PageService-window"
         ref="WindowUpdateDescription"
         v-if="drawerService"
         :isShowing="popup.editDescription.isShowing"
         :description="popup.editDescription.input"
         @callback-change="
            (description) => windowAction('editDescription', 'ok', description)
         "
         @callback-cancel="() => windowAction('editDescription', 'dismiss')"
         @callback-dismiss="() => windowAction('editDescription', 'dismiss')"
      />

      <WindowUpdateBelonging
         class="PageService-window"
         ref="WindowUpdateBelonging"
         v-if="drawerService"
         :isShowing="popup.belongings.isShowing"
         :values="popup.belongings.input"
         @callback-change="
            (belongings) => windowAction('belongings', 'ok', belongings)
         "
         @callback-cancel="() => windowAction('belongings', 'dismiss')"
         @callback-dismiss="() => windowAction('belongings', 'dismiss')"
      />

      <WindowRemove
         class="PageService-window"
         :isShowing="popup.removeService.isShowing"
         title="Delete Service"
         message="After deleting this service, it cannot be reverted."
         :value="popup.removeService.input"
         @click-cancel="() => windowAction('removeService', 'dismiss')"
         @click-ok="(service) => windowAction('removeService', 'ok', service)"
         @click-dismiss="() => windowAction('removeService', 'dismiss')"
      />

      <WindowRemove
         class="PageService-window-child"
         v-if="drawerService"
         :isShowing="popup.removeEvent.isShowing"
         title="Delete Event"
         message="After deleting this event, it cannot be reverted."
         :value="popup.removeEvent.input"
         @click-cancel="() => windowAction('removeEvent', 'dismiss')"
         @click-ok="(value) => windowAction('removeEvent', 'ok', value)"
         @click-dismiss="() => windowAction('removeEvent', 'dismiss')"
      />

      <WindowRemove
         class="PageService-window-child"
         v-if="drawerService"
         :isShowing="popup.removeImage.isShowing"
         title="Delete Image"
         message="After deleting this image, it cannot be reverted."
         :value="popup.removeImage.input"
         @click-cancel="() => windowAction('removeImage', 'dismiss')"
         @click-ok="(image) => windowAction('removeImage', 'ok', image)"
         @click-dismiss="() => windowAction('removeImage', 'dismiss')"
      />

      <Loading
         class="PageService-loading"
         :isShowing="serviceStore.getters.isLoading"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PageService {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: stretch;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      position: relative;

      --body-padding: 0.9rem;

      .PageService-panels {
         width: 100%;
         height: 100%;
         z-index: 1;
         overflow: hidden;
         position: relative;

         display: flex;
         flex-direction: row;
         flex-grow: 1;
         align-items: stretch;

         .PageService-PanelServices {
            z-index: 1;
         }
         .PageService-PanelRightEmpty {
            z-index: 2;
            background-color: hsla(0, 0%, 0%, 0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .PageService-PanelRightEmpty-text {
               // font-weight: 600;
               font-size: 1.2rem;
               color: hsl(0, 0%, 84%);
               background: hsla(0, 0%, 0%, 0.04);
               border-radius: 1rem;
               padding: 4rem 5rem;
            }
         }

         .PageService-RightDrawer {
            z-index: 3;
            .PageService-PanelRight {
               width: 100dvw;
               max-width: 100%;
            }
         }
      }
      .PageService-panels[isWide="false"] {
         .PageService-PanelServices {
            width: 100dvw;
            max-width: 100%;
         }
         .PageService-PanelRightEmpty {
            display: none;
         }
         .PageService-RightDrawer {
            width: 100dvw;
            max-width: 100%;
         }
      }
      .PageService-panels[isWide="true"] {
         .PageService-PanelServices {
            width: 100dvw;
            max-width: 50%;
         }
         .PageService-PanelRightEmpty {
            width: 100dvw;
            max-width: 50%;
         }
         .PageService-RightDrawer {
            width: 100dvw;
            max-width: 50%;
            position: absolute;
         }
      }

      .PageService-window {
         z-index: 4;
         position: absolute;
         .PageService-window-child {
            max-width: 100%;
            height: 100%;
            overflow: auto;
         }
      }

      .PageService-loading {
         z-index: 5;
         bottom: 0;
         position: absolute;
      }
   }
</style>
