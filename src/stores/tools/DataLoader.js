import U from "@/U";
import ValidationChecker from "./ValidationChecker";
export default class DataLoader {
    static withStore(getStore = () => { }) {
        return new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
            .processor(() => getStore().state.processor)
            .setData((data) => {
            return getStore()
                .state.list.clear()
                .addItems(...U.optArray(data));
        })
            .getData(() => getStore().state.list.items);
    }
    $validator;
    _getProcessor;
    _loadData;
    _setData;
    _getData;
    constructor(arg = { timeout: 1000 * 60 * 10 }) {
        this.$validator = new ValidationChecker({ timeout: arg.timeout });
    }
    processor(callback) {
        this._getProcessor = callback;
        return this;
    }
    loadData(callback) {
        this._loadData = callback;
        return this;
    }
    setData(callback) {
        this._setData = callback;
        return this;
    }
    getData(callback) {
        this._getData = callback;
        return this;
    }
    doTimeout() {
        this.$validator.resetCheckpoint();
    }
    isTimeout() {
        return !this.$validator.isValid();
    }
    async data() {
        const validator = this.$validator;
        const processor = this._getProcessor?.();
        const getData = this._getData;
        const setData = this._setData;
        const loadData = this._loadData;
        if (!processor || !getData || !setData || !loadData) {
            throw new Error("DataLoader not properly initialized.");
        }
        return processor.acquire("DataLoader", async () => {
            try {
                if (validator.isValid())
                    return getData();
                const data = await new Promise((resolve, reject) => {
                    validator.resetCheckpoint();
                    setData(null);
                    loadData()
                        .then((data) => resolve(data))
                        .catch((error) => reject(error));
                });
                setData(data);
                validator.makeCheckpoint();
                return getData();
            }
            catch (error) {
                validator.resetCheckpoint();
                setData(null);
                throw error;
            }
        });
    }
}
