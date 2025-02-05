import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { optArray } from '@/U';
import { Brand } from '@/items/Brand';
import { getBrandList } from '@/request/Brand';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

export const useBrandStore = defineStore('brand', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getBrandList();
      const content = optArray(api.optArrayContent());
      return content.map((content) => {
        return new Brand().fromData(content);
      });
    });

  const processor = ref(new Processor());
  const list = ref(new List<Brand>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfId(id: string) {
    let items: Brand[] = await getItems();
    return items.find((item) => item.id === id);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
  };
});
