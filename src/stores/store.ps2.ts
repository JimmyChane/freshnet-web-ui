import Vuex from 'vuex';

import { optArray } from '@/U';
import { getPs2DiscList } from '@/request/Ps2';

import { Ps2Disc as ItemPs2Disc } from '../items/Ps2Disc';
import { StoreBuilder } from './tools/StoreBuilder';

export const initPs2 = (Stores: any) => {
  const context = new StoreBuilder()
    .onFetchItems(async () => {
      const api = await getPs2DiscList();
      const content = optArray(api.optArrayContent());
      const items = content.map((content) => {
        return new ItemPs2Disc(Stores).fromData(content);
      });
      return items.sort((a, b) => a.compare(b));
    })
    .onGetStore(() => Stores.ps2)
    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getItems');
    })
    .action('getItems', async (context) => {
      return context.state.dataLoader.data();
    })
    .build();

  return new Vuex.Store(context);
};
