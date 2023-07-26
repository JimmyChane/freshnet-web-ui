import DataLoader from "./DataLoader";
import List from "./List";
import Processor from "./Processor";

type StateType = {
  dataLoader?: DataLoader;
  processor?: Processor;
  list?: List;
};

export default class StoreBuilder {
  private _fetchItems: () => any = () => {};
  private _getStore: () => void = () => {};
  private _idProperty: string = "id";

  state: StateType = {};
  mutations: any = {};
  getters: any = {};
  actions: any = {};

  onFetchItems(fetchItems: () => any = () => {}): this {
    this._fetchItems = fetchItems;
    return this;
  }
  onGetStore(getStore: () => void = () => {}): this {
    this._getStore = getStore;
    return this;
  }
  onIdProperty(idProperty: string = this._idProperty): this {
    this._idProperty = idProperty;
    return this;
  }

  action(key: string, fun: (context: any, arg: any) => any): this {
    this.actions[key] = async (context: any, arg: any) => {
      return context.state.processor.acquire(key, () => fun(context, arg));
    };
    return this;
  }

  build(): this {
    this.state.dataLoader = DataLoader.withStore(() => {
      return this._getStore();
    }).loadData(() => {
      return this._fetchItems();
    });
    this.state.processor = new Processor();
    this.state.list = new List(this._idProperty);

    this.getters.isLoading = (state: StateType) => state.processor?.isLoading();
    this.getters.lastModified = (state: StateType) => state.list?.lastModified;
    this.getters.items = (state: StateType) => state.list?.items;

    return this;
  }
}
