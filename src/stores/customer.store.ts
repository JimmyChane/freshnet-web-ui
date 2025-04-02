import { optArray } from '@chanzor/utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { addCustomer, getCustomerList } from '@/entity/api/Customer';
import { Customer, type CustomerData } from '@/entity/model/Customer';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

import { useDeviceStore } from './device.store';

export const useCustomerStore = defineStore('customer', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getCustomerList();
      const content: CustomerData[] = optArray(api.optArrayContent());
      return content.map((content) => {
        return new Customer().fromData(content);
      });
    });

  const processor = ref(new Processor());
  const list = ref(new List<Customer>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
    await useDeviceStore().refresh();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function addItem(arg: CustomerData) {
    const data: any = new Customer().fromData(arg).toData();
    delete data.id;
    const api = await addCustomer(data);
    const content = api.optObjectContent();
    const item = new Customer().fromData(content);
    return list.value.addItem(item);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    addItem,
  };
});
