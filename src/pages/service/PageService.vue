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

   import HostIcon from "@/host/HostIcon";

   import PopupContext from "@/tools/PopupContext";

   import PanelRight from "@/components/panel/PanelRight.vue";

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
         PanelRight,
      },
      data: (c) => ({
         actions: {
            onClickClose: () => c.clickService(null),
            onClickRemove: (service) => c.clickRemoveService(service),
            onClickToAddEvent: (event) => {
               const arg = { serviceID: c.currentService.id, data: event };
               c.serviceStore.dispatch("addEventToId", arg).catch((error) => {
                  c.store.dispatch("snackbarShow", "Failed to create an event");
                  throw error;
               });
            },
            onClickRemoveEvent: (event) => c.cllickRemoveServiceEvent(event),
            onClickRemoveImage: (image) => c.clickRemoveServiceImage(image),
            onClickUpdateCustomer: (customer) =>
               c.clickEditServiceCustomer(customer),
            onClickUpdateDescription: (description) =>
               c.clickEditServiceDescritpion(description),
            onClickUpdateBelongings: (belongings) =>
               c.clickEditServiceBelongings(belongings),
         },
         popup: { search: new PopupContext(c) },
         panelListened: { isWide: false },

         items: [],
         searchResults: [],

         currentService: null,
         drawerService: null,
      }),
      computed: {
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

            if (!service) {
               this.clickService(null);
               return;
            }

            if (this.currentServiceId === service.id) {
               this.updateServiceUI(service);
            }
         },

         updateServiceUI(service) {
            const hasNextService = !!service;

            this.currentService = service ?? null;
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
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowAddService,
               onConfirm: async (accept, reject, data) => {
                  try {
                     const result = await this.serviceStore.dispatch(
                        "addItem",
                        { data },
                     );

                     result ? accept() : reject();
                     this.clickService(result);
                  } catch (error) {
                     this.store.dispatch(
                        "snackbarShow",
                        "Failed to create a service",
                     );
                     reject();
                     throw error;
                  }
               },
            });
         },
         clickImportService() {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowImportService,
               showService: (service) => this.clickService(service),
            });
         },
         clickService(service) {
            service = service ? service : null;

            const hasPreviousSerivce = !!this.currentService;
            const hasNextService = !!service;
            const query = { service: service?.id ?? null };

            if (hasPreviousSerivce && hasNextService) {
               this.$root.replaceQuery({ query });
            } else {
               this.$root.nextQuery({ query });
            }

            this.updateServiceUI(service);
         },

         clickRemoveService(service) {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowRemove,
               title: "Delete Service",
               message: "After deleting this service, it cannot be reverted.",
               value: service,
               onConfirm: async (accept, reject) => {
                  try {
                     await this.serviceStore.dispatch("removeItemOfId", {
                        id: service.id,
                     });
                     accept();
                     if (this.currentServiceId === service.id) {
                        this.$root.replaceQuery({ query: { service: null } });
                     }
                  } catch (error) {
                     this.store.dispatch("snackbarShow", "Delete Failed");
                     reject();
                     throw error;
                  }
               },
            });
         },
         cllickRemoveServiceEvent(data) {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowRemove,
               title: "Delete Event",
               message: "After deleting this event, it cannot be reverted.",
               value: data,
               onConfirm: async (accept, reject) => {
                  await this.serviceStore.dispatch("removeEventFromId", {
                     serviceID: data.service.id,
                     time: data.event.timestamp.time,
                  });
                  accept();
               },
            });
         },
         clickRemoveServiceImage(image) {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowRemove,
               title: "Delete Image",
               message: "After deleting this image, it cannot be reverted.",
               value: image,
               onConfirm: async (accept, reject) => {
                  try {
                     const service = await this.serviceStore.dispatch(
                        "removeImageFromId",
                        { serviceID: this.currentService.id, image },
                     );
                     this.store.dispatch("imageViewerHide");
                     accept();
                  } catch (error) {
                     this.store.dispatch("snackbarShow", "Delete Image Failed");
                     reject();
                     throw error;
                  }
               },
            });
         },

         clickEditServiceDescritpion(description) {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowUpdateDescription,
               description,
               onConfirm: async (accept, reject, description) => {
                  try {
                     const service = await this.serviceStore.dispatch(
                        "updateDescriptionOfId",
                        { serviceID: this.currentService.id, description },
                     );
                     accept();
                  } catch (error) {
                     this.store.dispatch(
                        "snackbarShow",
                        "Update Description Failed",
                     );
                     reject();
                     throw error;
                  }
               },
            });
         },
         clickEditServiceBelongings(belongings) {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowUpdateBelonging,
               values: belongings,
               onConfirm: async (accept, reject, belongings) => {
                  try {
                     const service = await this.serviceStore.dispatch(
                        "updateBelongingsOfId",
                        { serviceID: this.currentService.id, belongings },
                     );
                     accept();
                  } catch (error) {
                     this.store.dispatch(
                        "snackbarShow",
                        "Update Belongings Failed",
                     );
                     reject();
                     throw error;
                  }
               },
            });
         },
         clickEditServiceCustomer(customer) {
            const popupWindow = this.store.dispatch("openPopupWindow", {
               component: WindowUpdateCustomer,
               value: customer,
               onConfirm: async (accept, reject, customer) => {
                  try {
                     const service = await this.serviceStore.dispatch(
                        "updateCustomerOfId",
                        { serviceID: this.currentService.id, customer },
                     );
                     accept();
                  } catch (error) {
                     this.store.dispatch(
                        "snackbarShow",
                        "Update Customer Failed",
                     );
                     reject();
                     throw error;
                  }
               },
            });
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
      <div class="PageService-panels" :isPanelWide="`${panelListened.isWide}`">
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

         <PanelRight
            class="PageService-PanelRight"
            titleEmpty="Select service to view"
            :isShowing="!!currentService"
            @click-collapse="
               () => $root.nextQuery({ query: { service: null } })
            "
            @on-isWide="(isWide) => (panelListened.isWide = isWide)"
         >
            <PanelService
               class="PageService-PanelRight"
               :service="drawerService"
               :actions="actions"
            />
         </PanelRight>
      </div>

      <WindowSearch
         v-if="$root.window.innerWidth <= 600"
         :isShowing="popup.search.isShowing"
         :items="items"
         @click-dismiss="() => windowAction('search', 'dismiss')"
         @click-item="(item) => clickService(item)"
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
         .PageService-PanelRight {
            z-index: 2;
         }
      }
      .PageService-panels[isPanelWide="false"] {
         .PageService-PanelServices {
            width: 100dvw;
            max-width: 100%;
         }
      }
      .PageService-panels[isPanelWide="true"] {
         .PageService-PanelServices {
            width: 100dvw;
            max-width: 50%;
         }
      }

      .PageService-loading {
         z-index: 5;
         bottom: 0;
         position: absolute;
      }
   }
</style>
