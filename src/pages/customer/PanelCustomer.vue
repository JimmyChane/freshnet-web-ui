<script>
import chroma from 'chroma-js';

import IconAdd from '@/assets/icon/add-000000.svg';
import IconCall from '@/assets/icon/call-color.svg';
import IconClose from '@/assets/icon/close-000000.svg';
import IconEdit from '@/assets/icon/edit-000000.svg';
import IconTrash from '@/assets/icon/trash-000000.svg';
import IconWhatsapp from '@/assets/icon/whatsapp-color.svg';
import Loading from '@/components/Loading.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import { Customer } from '@/items/Customer';
import PanelItemCustomer from '@/pages/manage/PanelItem-Customer.vue';
import Section from '@/pages/manage/PanelItem-Section.vue';
import ItemService from '@/pages/service/item-service/ItemService.vue';

import ItemDevice from './ItemDevice.vue';
import PanelCustomerEmpty from './PanelCustomer-Empty.vue';
import Item from './PanelCustomer-Item.vue';

export default {
  components: {
    Actionbar,
    Loading,
    Section,
    Item,
    ItemService,
    ItemDevice,
    PanelCustomerEmpty,
    PanelItemCustomer,
  },
  emits: [
    'click-item-close',
    'click-item-remove',
    'click-item-device-remove',
    'click-item-device-update-specifications',
    'click-item-device-update-description',
  ],
  props: {
    item: { type: Customer, default: () => null },
  },
  data: (c) => ({
    IconClose,
    IconEdit,
    IconAdd,
    top: { showShadow: false },

    devices: [],
    isLoadingDevices: false,
  }),
  computed: {
    isWide: (c) => c.$store.getters.window.innerWidth > 600,

    menus: (c) => {
      const menus = [];

      if (c.isPhoneNumber) {
        menus.push({
          title: 'Chat with Customer on Whatsapp',
          icon: IconWhatsapp,
          alth: 'Chat on Whatsapp',
          href: `https://api.whatsapp.com/send?phone=6${c.phoneNumberStr}`,
          target: '_blank',
        });
        menus.push({
          title: 'Call Customer',
          icon: IconCall,
          href: `tel:+6${c.phoneNumberStr}`,
        });
      }

      if (c.isFromStoreCustomer) {
        menus.push({
          title: 'Delete Customer',
          icon: IconTrash,
          click: () => c.$emit('click-item-remove', { item: c.item }),
          isHidden: true,
        });
      }

      return menus;
    },

    id: (c) => c.item?.id ?? '',
    name: (c) => c.item?.name ?? '',
    phoneNumber: (c) => c.item?.phoneNumber ?? null,
    phoneNumberStr: (c) => c.phoneNumber?.toString() ?? '',
    isPhoneNumber: (c) => !!c.phoneNumberStr,
    description: (c) => c.item?.description ?? '',
    deviceIds: (c) => c.item?.deviceIds ?? [],
    services: (c) => c.item?.services ?? [],
    orders: (c) => c.item?.orders ?? [],
    isFromStoreCustomer: (c) => c.item?.isFromStoreCustomer() ?? false,

    primaryColor: () => chroma('294656'),
    actionbarColor: (c) => c.backgroundColor.brighten(0.4),
    actionbarShadow: (c) => c.actionbarColor.darken(0.8),
    backgroundColor: (c) => c.primaryColor.mix('ffffff', 0.65),
  },
  watch: {
    item() {
      this.invalidateDevices();
    },
    'item.deviceIds'() {
      this.invalidateDevices();
    },
  },
  mounted() {
    this.invalidateDevices();
  },
  methods: {
    async invalidateDevices() {
      this.devices = [];

      if (!this.deviceIds.length) {
        return;
      }

      const cacheItem = this.item;
      this.isLoadingDevices = true;

      const devices =
        await this.$store.state.stores.customer.dispatch('getDevices');
      if (this.item !== cacheItem) {
        return;
      }

      this.isLoadingDevices = false;
      this.devices = this.item.deviceIds.map((deviceId) => {
        const device = devices.find((device) => device.id === deviceId);
        return { deviceId, device };
      });
    },
  },
};
</script>

<template>
  <div
    class="PanelCustomer"
    :style="{ 'background-color': backgroundColor }"
    @scroll="(event) => (top.showShadow = event.target.scrollTop > 0)"
  >
    <div class="PanelCustomer-body">
      <Actionbar
        class="PanelCustomer-actionbar"
        :style="{ 'background-color': actionbarColor }"
        :leftMenus="{
          key: 'close',
          title: 'Close',
          icon: IconClose,
          click: () => $emit('click-item-close', { item }),
        }"
        :rightMenus="menus"
      >
        <PanelItemCustomer
          v-if="item"
          :customer="item"
          :isEditable="item.isModifiable()"
          @click-edit="(item) => $emit('click-item-customer-update', { item })"
        />
      </Actionbar>

      <div class="PanelCustomer-main" :isWide="`${isWide}`">
        <Section
          title="Description"
          v-if="id"
          :menus="{
            icon: IconEdit,
            click: () => $emit('click-item-description-update', { item }),
          }"
        >
          <span v-if="description">{{ description }}</span>
          <PanelCustomerEmpty v-else />
        </Section>

        <Section
          title="Owned Devices"
          v-if="isFromStoreCustomer"
          :menus="{
            icon: IconAdd,
            click: () => $emit('click-item-device-add', { item }),
          }"
        >
          <div class="PanelCustomer-section-devices">
            <ItemDevice
              v-for="deviceContext of devices"
              :key="deviceContext.deviceId"
              :item="deviceContext.device"
              @click-remove="
                (param) =>
                  $emit('click-item-device-remove', {
                    item,
                    device: param.item,
                  })
              "
              @click-update-specifications="
                (param) =>
                  $emit('click-item-device-update-specifications', {
                    item,
                    device: param.item,
                    specifications: param.item.specifications,
                  })
              "
              @click-update-description="
                (param) =>
                  $emit('click-item-device-update-description', {
                    item,
                    device: param.item,
                    description: param.item.description,
                  })
              "
            />
          </div>

          <PanelCustomerEmpty v-if="!devices.length" />
          <Loading
            class="PanelCustomer-devices-loading"
            :isShowing="isLoadingDevices"
          />
        </Section>

        <Section title="Services">
          <router-link
            class="PanelCustomer-SectionService-item"
            v-for="service of services"
            :key="service.id"
            :to="{
              path: '/manage/service',
              query: { service: service.id },
            }"
          >
            <ItemService :headerCustomer="false" :item="service" />
          </router-link>
          <PanelCustomerEmpty v-if="!services.length" />
        </Section>

        <Section title="Orders">
          <Item
            v-for="order of orders"
            :key="order.id"
            :to="{
              path: '/manage/order',
              query: { order: order.id },
            }"
            title="Content"
          >
            <span>{{ order.content }}</span>
          </Item>
          <PanelCustomerEmpty v-if="!orders.length" />
        </Section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PanelCustomer {
  width: 100%;
  width: 100dvw;
  max-width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-x: hidden;

  .PanelCustomer-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    .PanelCustomer-main {
      width: 40rem;
      max-width: 100%;

      padding-bottom: 10rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      row-gap: 0.5rem;

      & > * {
        border-radius: 1rem;
        overflow: hidden;
      }

      .PanelCustomer-section-devices {
        display: flex;
        flex-direction: column;
        border-radius: 1rem;
        gap: 3px;
        overflow: hidden;
      }
      .PanelCustomer-devices-loading {
        width: 100%;
        height: 4px;
      }
      .PanelCustomer-SectionService-item {
        width: 100%;
        border-radius: 1rem;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
    }
  }
}
</style>
