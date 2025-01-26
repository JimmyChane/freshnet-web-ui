import Vuex from 'vuex';

import { optArray } from '@/U';
import { Brand } from '@/items/Brand';
import { getBrandList } from '@/request/Brand';

import { StoreBuilder } from './tools/StoreBuilder';

export const initBrand = (Stores: any) => {
  const context = new StoreBuilder<Brand>()
    .onFetchItems(async () => {
      const api = await getBrandList();
      const content = optArray(api.optArrayContent());
      return content.map((content) => new Brand(Stores).fromData(content));
    })
    .onGetStore(() => Stores.brand)
    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getItems');
    })
    .action('getItems', async (context) => {
      return context.state.dataLoader.data();
    })
    .action('getItemOfId', async (context, id = '') => {
      let items: Brand[] = await context.dispatch('getItems');
      return items.find((item) => item.id === id);
    })
    .build();

  return new Vuex.Store(context);
};
