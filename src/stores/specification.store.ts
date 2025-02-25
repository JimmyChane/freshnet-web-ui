import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { optArray } from '@/U';
import { getSpecificationList } from '@/entity/api/Specification';
import { Type } from '@/entity/model/Specification';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

export const useSpecificationStore = defineStore('specification', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getSpecificationList();
      const content = optArray(api.optArrayContent());

      return content.map((content) => new Type().fromData(content));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Type>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfKey(key: string) {
    const items: Type[] = await getItems();
    return items.find((item) => item.key === key);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfKey,
  };
});
