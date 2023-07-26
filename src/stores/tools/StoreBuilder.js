import DataLoader from "./DataLoader";
import List from "./List";
import Processor from "./Processor";
export default class StoreBuilder {
    _fetchItems = () => { };
    _getStore = () => { };
    _idProperty = "id";
    state = {};
    mutations = {};
    getters = {};
    actions = {};
    onFetchItems(fetchItems = () => { }) {
        this._fetchItems = fetchItems;
        return this;
    }
    onGetStore(getStore = () => { }) {
        this._getStore = getStore;
        return this;
    }
    onIdProperty(idProperty = this._idProperty) {
        this._idProperty = idProperty;
        return this;
    }
    action(key, fun) {
        this.actions[key] = async (context, arg) => {
            return context.state.processor.acquire(key, () => fun(context, arg));
        };
        return this;
    }
    build() {
        this.state.dataLoader = DataLoader.withStore(() => {
            return this._getStore();
        }).loadData(() => {
            return this._fetchItems();
        });
        this.state.processor = new Processor();
        this.state.list = new List(this._idProperty);
        this.getters.isLoading = (state) => state.processor?.isLoading();
        this.getters.lastModified = (state) => state.list?.lastModified;
        this.getters.items = (state) => state.list?.items;
        return this;
    }
}
