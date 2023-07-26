import U from "@/U";
export default class CustomerDeviceSpecification {
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    typeKey = "";
    content = "";
    fromData(data) {
        this.typeKey = U.trimId(data.typeKey);
        this.content = U.trimText(data.content);
        return this;
    }
    toData() {
        return {
            typeKey: U.trimId(this.typeKey),
            content: U.trimText(this.content),
        };
    }
    toCount(strs) {
        return 0;
    }
    compare(item) {
        return 0;
    }
}
