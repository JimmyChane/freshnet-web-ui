import DataLoader from "./DataLoader";
import List from "./List";
import Processor from "./Processor";

export default class StoreBuilder {
   #fetchItems = () => {};
   #getStore = () => {};

   onFetchItems(fetchItems = () => {}) {
      this.#fetchItems = fetchItems;
      return this;
   }
   onGetStore(getStore = () => {}) {
      this.#getStore = getStore;
      return this;
   }
   build() {
      this.state = {
         dataLoader: DataLoader.withStore(() => this.#getStore()).loadData(() =>
            this.#fetchItems(),
         ),
         processor: new Processor(),
         list: new List(),
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
