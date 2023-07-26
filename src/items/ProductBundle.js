import U from "@/U";
export default class ProductBundle {
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    title = "";
    fromData(data) {
        this.title = U.trimText(data.title || "");
        return this;
    }
    toData() {
        return { title: U.trimText(this.title) };
    }
    toCount(strs) {
        return 0;
    }
    isEqual(item) {
        return this === item;
    }
    compare(item) {
        return 0;
    }
}
