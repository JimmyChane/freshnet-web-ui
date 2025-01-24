import { ActionContext } from 'vuex';

import DataLoader from './DataLoader';
import List, { Item } from './List';
import Processor from './Processor';

type StateType<T extends Item> = {
  dataLoader: DataLoader;
  processor: Processor;
  list: List<T>;
};

export default class StoreBuilder<T extends Item> {
  private _fetchItems: () => any = () => {};
  private _getStore: () => void = () => {};

  state: StateType<T>;
  mutations: any = {};
  getters: any = {};
  actions: any = {};

  constructor() {
    this.state = {
      dataLoader: DataLoader.withStore(() => {
        return this._getStore();
      }).loadData(() => {
        return this._fetchItems();
      }),
      processor: new Processor(),
      list: new List(),
    };

    this.getters.isLoading = (state: StateType<T>) => {
      return state.processor.isLoading();
    };
    this.getters.lastModified = (state: StateType<T>) => {
      return state.list.lastModified;
    };
    this.getters.items = (state: StateType<T>) => state.list.items;
  }

  onFetchItems(fetchItems: () => any = () => {}): this {
    this._fetchItems = fetchItems;
    return this;
  }
  onGetStore(getStore: () => void = () => {}): this {
    this._getStore = getStore;
    return this;
  }

  action(
    key: string,
    fun: (context: ActionContext<StateType<T>, StateType<T>>, arg: any) => any,
  ): this {
    this.actions[key] = async (context: any, arg: any) => {
      return context.state.processor.acquire(key, () => fun(context, arg));
    };
    return this;
  }

  build(): this {
    return this;
  }
}
