<script>
import { mapStores } from 'pinia';

import IconRefresh from '@/assets/icon/refresh-000000.svg';
import Loading from '@/components/Loading.vue';
import PanelRight from '@/components/panel/PanelRight.vue';
import WindowRemove from '@/components/window/WindowRemove.vue';
import { onCreatedRoute } from '@/mixin';
import { useLoginStore } from '@/pinia-stores/login.store';
import { useServiceStore } from '@/pinia-stores/service.store';
import { SERVICE_ROUTE } from '@/router';

import PanelService from './PanelService.vue';
import PanelServices from './PanelServices.vue';
import WindowAddService from './WindowAddService.vue';
import WindowImportService from './WindowImportService.vue';
import WindowSearch from './WindowSearch.vue';
import WindowUpdateBelonging from './WindowUpdateBelonging.vue';
import WindowUpdateCustomer from './WindowUpdateCustomer.vue';
import WindowUpdateDescription from './WindowUpdateDescription.vue';

export default {
  components: { PanelServices, Loading, PanelService, PanelRight },
  data: (c) => ({
    actions: {
      onClickClose: () => c.clickService(null),
      onClickRemove: (service) => c.clickRemoveService(service),
      onClickToAddEvent: (event) => {
        const arg = { serviceID: c.currentService.id, data: event };
        useServiceStore()
          .addEventToId(arg)
          .catch((error) => {
            c.$store.dispatch('snackbarShow', 'Failed to create an event');
            throw error;
          });
      },
      onClickRemoveEvent: (event) => c.cllickRemoveServiceEvent(event),
      onClickRemoveImage: (image) => c.clickRemoveServiceImage(image),
      onClickUpdateCustomer: (customer) => c.clickEditServiceCustomer(customer),
      onClickUpdateDescription: (description) =>
        c.clickEditServiceDescritpion(description),
      onClickUpdateBelongings: (belongings) =>
        c.clickEditServiceBelongings(belongings),
    },
    panelListened: { isWide: false },

    items: [],
    searchResults: [],

    currentService: null,
    drawerService: null,
  }),
  computed: {
    ...mapStores(useServiceStore),

    actionMenus: (c) => {
      return [
        {
          key: 'refresh',
          title: 'Refresh',
          icon: IconRefresh,
          click: () => c.clickRefresh(),
        },
      ];
    },

    currentUser: (c) => useLoginStore().user,

    lastModified: (c) => useServiceStore().lastModified,
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
  created() {
    onCreatedRoute(SERVICE_ROUTE);
  },
  mounted() {
    this.invalidate();
    useServiceStore().refresh();
  },
  methods: {
    async invalidate() {
      const items = await useServiceStore().getItems();
      for (const item of items) {
        item.events.sort((event1, event2) => event1.compare(event2));
      }
      items.sort((item1, item2) => item1.compare(item2));

      this.items = items;

      await useLoginStore().refresh();
      await this.invalidateServiceId();
    },
    async invalidateServiceId() {
      this.currentService = null;

      if (!this.currentServiceId) {
        return;
      }

      const service = await useServiceStore().getItemOfId(
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
      useServiceStore().refresh();
    },
    clickAddService() {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowAddService,
        onConfirm: async (accept, reject, data) => {
          try {
            const result = await useServiceStore().addItem({ data });

            result ? accept() : reject();
            this.clickService(result);
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Failed to create a service');
            reject();
            throw error;
          }
        },
      });
    },
    clickImportService() {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
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
        this.$store.getters.replaceQuery({ query });
      } else {
        this.$store.getters.nextQuery({ query });
      }

      this.updateServiceUI(service);
    },
    clickSearch() {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowSearch,
        items: this.items,
        clickItem: (service) => {
          this.clickService(service);
        },
      });
    },

    clickRemoveService(service) {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowRemove,
        title: 'Delete Service',
        message: 'After deleting this service, it cannot be reverted.',
        value: service,
        onConfirm: async (accept, reject) => {
          try {
            await useServiceStore().removeItemOfId({ id: service.id });
            accept();
            if (this.currentServiceId === service.id) {
              this.$store.getters.replaceQuery({ query: { service: null } });
            }
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Delete Failed');
            reject();
            throw error;
          }
        },
      });
    },
    cllickRemoveServiceEvent(data) {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowRemove,
        title: 'Delete Event',
        message: 'After deleting this event, it cannot be reverted.',
        value: data,
        onConfirm: async (accept, reject) => {
          await useServiceStore().removeEventFromId({
            serviceID: data.service.id,
            time: data.event.timestamp.time,
          });
          accept();
        },
      });
    },
    clickRemoveServiceImage(image) {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowRemove,
        title: 'Delete Image',
        message: 'After deleting this image, it cannot be reverted.',
        value: image,
        onConfirm: async (accept, reject) => {
          try {
            const service = await useServiceStore().removeImageFromId({
              serviceID: this.currentService.id,
              image,
            });
            this.$store.dispatch('imageViewerHide');
            accept();
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Delete Image Failed');
            reject();
            throw error;
          }
        },
      });
    },

    clickEditServiceDescritpion(description) {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowUpdateDescription,
        description,
        onConfirm: async (accept, reject, description) => {
          try {
            const service = await useServiceStore().updateDescriptionOfId({
              serviceID: this.currentService.id,
              description,
            });
            accept();
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Update Description Failed');
            reject();
            throw error;
          }
        },
      });
    },
    clickEditServiceBelongings(belongings) {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowUpdateBelonging,
        values: belongings,
        onConfirm: async (accept, reject, belongings) => {
          try {
            const service = await useServiceStore().updateBelongingsOfId({
              serviceID: this.currentService.id,
              belongings,
            });
            accept();
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Update Belongings Failed');
            reject();
            throw error;
          }
        },
      });
    },
    clickEditServiceCustomer(customer) {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowUpdateCustomer,
        value: customer,
        onConfirm: async (accept, reject, customer) => {
          try {
            const service = await useServiceStore().updateCustomerOfId(
              'updateCustomerOfId',
              { serviceID: this.currentService.id, customer },
            );
            accept();
          } catch (error) {
            this.$store.dispatch('snackbarShow', 'Update Customer Failed');
            reject();
            throw error;
          }
        },
      });
    },
  },
};
</script>

<template>
  <div class="PageService" :isPanelWide="`${panelListened.isWide}`">
    <PanelServices
      class="PageService-PanelServices"
      :menus="actionMenus"
      :services="items"
      :currentItem="currentService"
      @click-service="(item) => clickService(item)"
      @click-search="() => clickSearch()"
      @click-add="() => clickAddService()"
      @click-import="() => clickImportService()"
    />

    <PanelRight
      class="PageService-PanelRight"
      titleEmpty="Select service to view"
      :isShowing="!!currentService"
      @click-collapse="
        () => $store.getters.nextQuery({ query: { service: null } })
      "
      @on-isWide="(isWide) => (panelListened.isWide = isWide)"
    >
      <PanelService
        class="PageService-PanelRight"
        :service="drawerService"
        :actions="actions"
      />
    </PanelRight>

    <Loading class="PageService-loading" :isShowing="serviceStore.isLoading" />
  </div>
</template>

<style lang="scss" scoped>
.PageService {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .PageService-PanelServices {
    z-index: 1;
  }
  .PageService-PanelRight {
    z-index: 2;
  }
  .PageService-loading {
    z-index: 5;
    bottom: 0;
    position: absolute;
  }
}
.PageService[isPanelWide='false'] {
  .PageService-PanelServices {
    width: 100dvw;
    max-width: 100%;
  }
}
.PageService[isPanelWide='true'] {
  .PageService-PanelServices {
    width: 100dvw;
    max-width: 50%;
  }
}
</style>
