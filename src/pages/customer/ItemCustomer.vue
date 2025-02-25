<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import IconOrder from '@/assets/icon/order-505050.svg';
import IconService from '@/assets/icon/service-505050.svg';
import { Customer } from '@/entity/model/Customer';

import ItemButton from '@/pages/manage/PanelItems-ItemButton.vue';

import Label from './ItemCustomer-Label.vue';
import LabelDevice from './ItemCustomer-LabelDevice.vue';

const emits = defineEmits<{
  click: [{ item: Customer | undefined | null }];
  clickRemove: [void];
}>();

const props = withDefaults(
  defineProps<{ item?: Customer | null; selected?: boolean }>(),
  { item: null, default: false },
);

const itemDeviceGroups = ref<any[]>();

const name = computed(() => props.item?.name);
const phoneNumber = computed(() => props.item?.phoneNumber);
const phoneNumberStr = computed(() => phoneNumber.value?.toString() ?? '');
const services = computed(() => props.item?.services ?? []);
const orders = computed(() => props.item?.orders ?? []);

watch([() => props.item], () => invalidate());

async function invalidate() {
  itemDeviceGroups.value = [];
  if (!props.item) return;

  const previousName = name.value;
  const previousPhoneNumberStr = phoneNumberStr.value;

  const localItemDeviceGroups =
    await props.item.fetchDeviceGroups('categoryKey');

  if (
    previousName === name.value &&
    previousPhoneNumberStr === phoneNumberStr.value
  ) {
    itemDeviceGroups.value = localItemDeviceGroups;
  }
}

onMounted(() => invalidate());
</script>

<template>
  <ItemButton
    class="ItemCustomer"
    :isSelected="selected"
    @focus="emits('click', { item })"
  >
    <div class="ItemCustomer-body">
      <div class="ItemCustomer-header">
        <span>{{ name }}</span>
        <span>{{ phoneNumberStr }}</span>
      </div>

      <div
        class="ItemCustomer-labels"
        v-if="
          item?.description ||
          itemDeviceGroups?.length ||
          services.length ||
          orders.length
        "
      >
        <LabelDevice
          v-for="group of itemDeviceGroups"
          :key="group.categoryKey"
          :categoryKey="group.categoryKey"
          :count="group.devices.length"
        />
        <Label
          v-if="services.length"
          :icon="IconService"
          :count="services.length"
        />
        <Label v-if="orders.length" :icon="IconOrder" :count="orders.length" />
      </div>
    </div>
  </ItemButton>
</template>

<style lang="scss" scoped>
.ItemCustomer {
  width: 100%;
  background: white;

  .ItemCustomer-body {
    width: 100%;
    font-weight: 400;
    font-size: 1rem;
    color: black;
    text-align: start;
    flex-grow: 1;
    height: unset;
    padding: 0.5rem 0.3rem;

    display: flex;
    flex-direction: row;
    align-items: stretch;

    .ItemCustomer-header {
      padding: 0.3rem 0.5rem;
      width: 100%;
      column-gap: 0.5rem;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      :nth-child(1) {
        font-size: 1em;
        color: black;
      }
      :nth-child(2) {
        font-size: 0.8em;
        color: rgba(0, 0, 0, 0.8);
      }
    }

    .ItemCustomer-labels {
      padding: 0.3rem 0.5rem;
      font-size: 1rem;
      gap: 0.1rem;
      display: flex;
      flex-direction: row;
      align-items: center;

      & > * {
        --primary-color: black;
        border-radius: 0.5rem;
        padding: 0.4rem;
      }
    }
  }
}
</style>
