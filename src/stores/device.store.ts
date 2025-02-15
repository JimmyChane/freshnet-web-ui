import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { Customer } from '@/items/Customer';
import { CustomerDevice } from '@/items/CustomerDevice';
import {
  addDevice,
  getDeviceList,
  removeDevice,
  updateDeviceDescription,
  updateDeviceSpecification,
} from '@/request/Device';
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
  async function getItemOfId(id = '') {
    if (typeof id !== 'string') return null;
    const items: CustomerDevice[] = await getItems();
    return items.find((item) => item.id === id) ?? null;
  }
  async function getItemsOfIds(ids: string[] = []) {
    if (!Array.isArray(ids)) return [];

    const items: CustomerDevice[] = await getItems();
    const results = ids.map((id) => {
      return items.find((item) => item.id === id) ?? null;
    });
    return results;
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
  async function removeItemOfId(arg: any) {
    const api = await removeDevice({
      content: {
        ownerCustomerId: arg.ownerCustomerId,
        deviceId: arg.id,
      },
    });
    const content = api.optObjectContent();
    const item = new CustomerDevice().fromData(content);
    const customer = useCustomerStore().items.find((customer: Customer) => {
      return customer.id === item.ownerCustomerId;
    });

    if (!customer) return;

    customer.deviceIds = customer.deviceIds.filter((deviceId: string) => {
      return deviceId !== item.id;
    });

    return list.value.removeItemByItem(item);
  }

  async function updateSpecificationsOfId(arg: {
    _id: string;
    specifications: any[];
  }) {
    const { _id, specifications } = arg;
    const api = await updateDeviceSpecification({
      content: { _id, specifications },
    });
    const content = api.optObjectContent();
    const inputItem = new CustomerDevice().fromData(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return;
      item.specifications = inputItem.specifications;
    });
  }
  async function updateDescriptionOfId(arg: {
    _id: string;
    description: string;
  }) {
    const { _id, description } = arg;
    const api = await updateDeviceDescription({
      content: { _id, description },
    });
    const content = api.optObjectContent();
    const inputItem = new CustomerDevice().fromData(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return;
      item.description = inputItem.description;
    });
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
    getItemsOfIds,
    addItem,
    removeItemOfId,
    updateSpecificationsOfId,
    updateDescriptionOfId,
  };
});
