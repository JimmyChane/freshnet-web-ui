import DataLoader from "./DataLoader";
import List from "./List";
import Processor from "./Processor";

export default class StoreBuilder {
   #fetchItems = () => {};
   #getStore = () => {};
   #idProperty = "id";

   state = {};
   mutations = {};
   getters = {};
   actions = {};

   onFetchItems(fetchItems = () => {}) {
      this.#fetchItems = fetchItems;
      return this;
   }
   onGetStore(getStore = () => {}) {
      this.#getStore = getStore;
      return this;
   }
   onIdProperty(idProperty = this.#idProperty) {
      this.#idProperty = idProperty;
      return this;
   }

   action(key = "", fun) {
      this.actions[key] = async (context, arg) => {
         return context.state.processor.acquire(key, () => fun(context, arg));
      };
      return this;
   }

   build() {
      this.state.dataLoader = DataLoader.withStore(() => this.#getStore()).loadData(() =>
         this.#fetchItems(),
      );
      this.state.processor = new Processor();
      this.state.list = new List(this.#idProperty);

      this.getters.isLoading = (state) => state.processor.isLoading();
      this.getters.lastModified = (state) => state.list.lastModified;
      this.getters.items = (state) => state.list.items;

      return this;
   }
}
