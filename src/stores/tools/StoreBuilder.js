import DataLoader from "./DataLoader";
import List from "./List";
import Processor from "./Processor";
export default class StoreBuilder {
    _fetchItems = () => { };
    _getStore = () => { };
    state;
    mutations = {};
    getters = {};
    actions = {};
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
        this.getters.isLoading = (state) => {
            return state.processor.isLoading();
        };
        this.getters.lastModified = (state) => {
            return state.list.lastModified;
        };
        this.getters.items = (state) => state.list.items;
    }
    onFetchItems(fetchItems = () => { }) {
        this._fetchItems = fetchItems;
        return this;
    }
    onGetStore(getStore = () => { }) {
        this._getStore = getStore;
        return this;
    }
    action(key, fun) {
        this.actions[key] = async (context, arg) => {
            return context.state.processor.acquire(key, () => fun(context, arg));
        };
        return this;
    }
    build() {
        return this;
    }
}
