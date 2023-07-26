const textContains = ItemSearcher.textContains;
import ServiceTimestamp from "./ServiceTimestamp";
import ServicePrice from "./ServicePrice";
import ServiceImage from "./ServiceImage";
import Method from "./ServiceEventMethod";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
export default class ServiceEvent {
    stores;
    userStore;
    constructor(stores) {
        this.stores = stores;
        this.userStore = stores.user;
    }
    timestamp = null;
    username = "";
    name = "";
    method = "";
    description = "";
    status = "";
    price = null;
    images = [];
    fromData(data) {
        this.timestamp = new ServiceTimestamp(data.time);
        this.username = U.trimId(data.username);
        this.name = U.trimText(data.nameOfUser);
        this.method = U.trimId(data.method);
        this.description = U.trimText(data.description);
        this.status = U.trimId(data.status);
        this.price = U.isObject(data.price)
            ? new ServicePrice().fromData(data.price)
            : null;
        this.images = U.optArray(data.images).map((image) => {
            return new ServiceImage(this.stores).fromData(image);
        });
        return this;
    }
    toData() {
        return {
            time: this.timestamp?.time ?? null,
            username: U.trimId(this.username),
            nameOfUser: U.trimText(this.name),
            method: U.trimId(this.method),
            description: U.trimText(this.description),
            status: U.trimId(this.status),
            price: this.price?.toData() ?? null,
            images: this.images.map((image) => image.toData()),
        };
    }
    toCount(strs) {
        let count = strs.reduce((count, str) => {
            if (textContains("event", str))
                count++;
            if (textContains(this.username, str))
                count++;
            if (textContains(this.name, str))
                count++;
            if (textContains(this.method, str))
                count++;
            if (textContains(this.description, str))
                count++;
            if (textContains(this.status, str))
                count++;
            return count;
        }, 0);
        count += this.timestamp ? this.timestamp.toCount(strs) : 0;
        return count;
    }
    toResult() {
        if (this.isQuotation() || this.isPurchase())
            return this.price;
        if (this.isInfo())
            return this.status;
        return null;
    }
    isInfo() {
        return this.method === Method.INFO.key;
    }
    isQuotation() {
        return this.method === Method.QUOTATION.key;
    }
    isPurchase() {
        return this.method === Method.PURCHASE.key;
    }
    compare(item) {
        return (item.timestamp?.time ?? 0) - (this.timestamp?.time ?? 0);
    }
    async fetchUser() {
        if (!U.isString(this.username) || this.username.trim().length === 0)
            return null;
        return await this.userStore.dispatch("getUserByUsername", this.username);
    }
    async fetchName() {
        const user = await this.fetchUser();
        const username = user ? user.username : "";
        if (username.length && this.name)
            return `${this.name}(${username})`;
        if (!username.length && this.name)
            return this.name;
        if (username.length && !this.name)
            return username;
        throw new Error("unknown");
    }
}
