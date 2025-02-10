<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
// todo: fix
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import { optString } from '@/U';
import Empty from '@/components/Empty.vue';
import { CUSTOMER_ROUTE } from '@/router';
import { useCustomerStore } from '@/stores/customer.store';

import ItemCustomer from './ItemCustomer.vue';
import Actionbar from './PanelCustomers-Actionbar.vue';

const emits = defineEmits<{
  clickRefresh: [void];
  clickItemAdd: [void];
  clickItemRemove: [{ item: any }];
}>();

const props = withDefaults(
  defineProps<{ title?: string; items?: any[]; itemSelected?: any }>(),
  { title: '', items: () => [], itemSelected: null },
);

const scrollTop = ref(0);
const itemSelect = ref<any>(null);

const customerStore = useCustomerStore();

const iconEmpty = computed(() => CUSTOMER_ROUTE.icon.dark.toUrl());

const route = useRoute();

const filter = computed(() => optString(route.query.filter));

const listService = computed(() => {
  return props.items.filter((item) => item.services.length);
});
const listOrder = computed(() => {
  return props.items.filter((item) => item.orders.length);
});
const list = computed(() => {
  switch (filter.value) {
    case 'service':
      return listService.value;
    case 'order':
      return listOrder.value;
    default:
      return props.items;
  }
});
const myList = computed(() => {
  return list.value.map((item) => {
    return { id: itemKey(item), item };
  });
});

function itemKey(item: any) {
  return `${itemName(item)}${itemPhoneNumberValue(item)}`;
}
function itemName(item: any) {
  return optString(item?.name);
}
function itemPhoneNumberValue(item: any) {
  return item?.phoneNumber?.value ?? '';
}
function itemPhoneNumberStr(item: any) {
  return optString(item?.phoneNumber.toUrl());
}
</script>

<template>
  <div
    class="PanelCustomers"
    @scroll="(event) => (scrollTop = event.target.scrollTop)"
  >
    <Actionbar
      class="PanelCustomers-top"
      :title="title"
      :items="items"
      @click-item-add="() => emits('click-item-add')"
      @click-refresh="() => emits('click-refresh')"
    />

    <DynamicScroller
      class="PanelCustomers-body"
      :items="myList"
      :min-item-size="90"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :data-index="index" :active="active">
          <div class="PanelCustomers-item-div">
            <router-link
              class="PanelCustomers-item"
              :to="{
                query: {
                  name: itemName(item.item),
                  phoneNumber: itemPhoneNumberValue(item.item),
                },
              }"
            >
              <ItemCustomer
                :item="item.item"
                :selected="item.item === itemSelected"
                @click-remove="
                  (_param: any) =>
                    emits('click-item-remove', { item: item.item })
                "
              />
            </router-link>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <Empty v-if="!list.length && !customerStore.isLoading" :icon="iconEmpty" />
  </div>
</template>

<style lang="scss" scoped>
.PanelCustomers {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  .PanelCustomers-top {
    z-index: 2;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
  }
  .PanelCustomers-body {
    --gap: 4px;

    z-index: 1;
    padding: calc(1rem - var(--gap) * 0.5) 1rem;
    padding-bottom: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .PanelCustomers-item-div {
      display: flex;
      padding: calc(var(--gap) * 0.5) 0;
    }
    .PanelCustomers-item {
      margin: 0 auto;
      width: 100%;
      max-width: 35rem;
      max-width: 25rem;

      text-decoration: none;
      font-size: 1rem;
      color: inherit;
      overflow: hidden;
    }
  }
}
</style>
