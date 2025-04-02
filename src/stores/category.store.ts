import { optArray } from '@chanzor/utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getCategoryList } from '@/entity/api/Category';
import { Category } from '@/entity/model/Category';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

export const useCategoryStore = defineStore('category', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getCategoryList();
      const content = optArray(api.optArrayContent());
      return content.map((content) => new Category().fromData(content));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Category>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
  };
});
