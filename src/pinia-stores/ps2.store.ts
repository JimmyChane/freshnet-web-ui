import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { optArray } from '@/U';
import { Ps2Disc } from '@/items/Ps2Disc';
import { getPs2DiscList } from '@/request/Ps2';
import { DataLoader } from '@/stores/tools/DataLoader';
import { List } from '@/stores/tools/List';
import { Processor } from '@/stores/tools/Processor';

export const usePs2Store = defineStore('ps2', () => {
  const dataLoader = new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await getPs2DiscList();
      const content = optArray(api.optArrayContent());
      const items = content.map((content) => {
        return new Ps2Disc(content);
      });
      return items.sort((a, b) => a.compare(b));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Ps2Disc>());

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
