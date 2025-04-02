import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { addDevice, getDeviceList } from '@/entity/api/Device';
import { Customer } from '@/entity/model/Customer';
import { CustomerDevice } from '@/entity/model/CustomerDevice';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

import { useCustomerStore } from './customer.store';

export const useDeviceStore = defineStore('device', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getDeviceList();
      const content: any[] = api.optArrayContent();
      return content.map((content) => {
        return new CustomerDevice().fromData(content);
      });
    });

  const processor = ref(new Processor());
  const list = ref(new List<CustomerDevice>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function addItem(arg: any) {
    const data: any = new CustomerDevice().fromData(arg).toData();
    delete data.id;
    const api = await addDevice({ content: data });
    const content = api.optObjectContent();
    const item = list.value.addItem(new CustomerDevice().fromData(content));
    if (item) {
      const customers: Customer[] = useCustomerStore().items;
      const customer = customers.find((customer) => {
        return customer.id === item.ownerCustomerId;
      });
      if (customer) customer.deviceIds.push(item.id);
    }
    return item;
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
