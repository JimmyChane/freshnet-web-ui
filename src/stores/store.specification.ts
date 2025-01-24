import Vuex from 'vuex';

import { optArray } from '@/U';
import { Type } from '@/items/Specification';
import { getSpecificationList } from '@/request/Specification';

import StoreBuilder from './tools/StoreBuilder';

const init = (Stores: any) => {
  const context = new StoreBuilder<Type>()
    .onFetchItems(async () => {
      const api = await getSpecificationList();
      const content = optArray(api.optArrayContent());

      return content.map((content) => {
        return new Type(Stores).fromData(content);
      });
    })
    .onGetStore(() => Stores.specification)
    .action('refresh', async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch('getItems');
    })
    .action('getItems', async (context) => {
      return context.state.dataLoader.data();
    })
    .action('getItemOfKey', async (context, key = '') => {
      const items: Type[] = await context.dispatch('getItems');
      return items.find((item) => item.key === key);
    })
    .build();

  return new Vuex.Store(context);
};

export default { init };
