import DataLoader from "./DataLoader";
import List from "./List";
import Processor from "./Processor";

export default class StoreBuilder {
   #fetchItems = () => {};
   #getStore = () => {};
   #idProperty = "id";

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
   build() {
      this.state = {
         dataLoader: DataLoader.withStore(() => this.#getStore()).loadData(() =>
            this.#fetchItems(),
         ),
         processor: new Processor(),
         list: new List(this.#idProperty),
      };
      this.mutations = {};
      this.getters = {
         isLoading: (state) => state.processor.isLoading(),
         lastModified: (state) => state.list.lastModified,
         items: (state) => state.list.items,
      };
      this.actions = {};

      return this;
   }
}
