import Vuex from 'vuex';

import { optArray } from '@/U';
import { Category } from '@/items/Category';
import { getCategoryList } from '@/request/Category';

import { StoreBuilder } from './tools/StoreBuilder';

export const initCategory = (Stores: any) => {
  const context = new StoreBuilder<Category>()
    .onFetchItems(async () => {
      const api = await getCategoryList();
      const content = optArray(api.optArrayContent());
      return content.map((content) => new Category(Stores).fromData(content));
    })
    .onGetStore(() => Stores.category)

    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getItems');
    })
    .action('getItems', async (context) => {
      return context.state.dataLoader.data();
    })
    .action('getItemOfId', async (context, id = '') => {
      const items: Category[] = await context.dispatch('getItems');
      return items.find((item) => item.id === id);
    })
    .action('getItemOfKey', async (context, key = '') => {
      const items: Category[] = await context.dispatch('getItems');
      return items.find((item) => item.key === key);
    })
    .build();

  return new Vuex.Store(context);
};
