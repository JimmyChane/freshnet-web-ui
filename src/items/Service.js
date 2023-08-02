import ServiceTimestamp from "./ServiceTimestamp";
import ServiceEvent from "./ServiceEvent";
import ServicePrice from "./ServicePrice";
import ServiceCustomer from "./ServiceCustomer";
import ServiceImage from "./ServiceImage";
import Label from "./ServiceLabel";
import Method from "./ServiceEventMethod";
import State from "./ServiceState";
import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
import ServiceBelonging from "./ServiceBelonging";
import ServiceEventMethod from "./ServiceEventMethod";
const textContains = ItemSearcher.textContains;
export default class Service {
    stores;
    userStore;
    constructor(stores) {
        this.stores = stores;
        this.userStore = stores.user;
    }
    id = "";
    timestamp = null;
    username = "";
    name = "";
    state = "";
    customer = null;
    description = "";
    belongings = [];
    _events = [];
    imageFiles = [];
    labels = [];
    fromData(data) {
        this.id = U.trimId(data._id);
        this.timestamp = data.time ? new ServiceTimestamp(data.time) : null;
        this.username = U.trimId(data.username);
        this.name = U.trimText(data.nameOfUser);
        switch (U.trimId(data.state)) {
            case State.PENDING.key:
                this.state = State.PENDING.key;
                break;
            case State.WAITING.key:
                this.state = State.WAITING.key;
                break;
            case State.COMPLETED.key:
                this.state = State.COMPLETED.key;
                break;
            case State.REJECTED.key:
                this.state = State.REJECTED.key;
                break;
            default:
                this.state = State.PENDING.key;
        }
        this.customer = U.isObject(data.customer)
            ? new ServiceCustomer(this.stores).fromData(data.customer)
            : null;
        this.description = U.trimText(data.description);
        this.belongings = U.optArray(data.belongings).map((belonging) => {
            return new ServiceBelonging(this.stores).fromData(belonging);
        });
        // events
        // const serviceData = this.toData();
        // const serviceEvent = new ServiceEvent(this.stores).fromData({
        //   method: ServiceEventMethod.INITIAL.key,
        //   time: serviceData.time,
        //   username: serviceData.username,
        //   name: serviceData.nameOfUser,
        //   description: serviceData.description,
        //   images: serviceData.imageFiles,
        // });
        this._events = U.optArray(data.events).map((subData) => {
            return new ServiceEvent(this.stores).fromData(subData);
        });
        // this._events.push(serviceEvent);
        // images
        this.imageFiles = U.optArray(data.imageFiles).map((image) => {
            return new ServiceImage(this.stores).fromData(image);
        });
        // labels
        this.labels = U.optArray(data.labels)
            .map((subData) => new Label().fromData(subData))
            .filter((label) => label.title.trim().length > 0);
        // refactoring notice to labels
        const existingLabelUrgent = this.labels.find((label) => {
            return label.title === Label.URGENT.title;
        });
        const existingLabelWarranty = this.labels.find((label) => {
            return label.title === Label.WARRANTY.title;
        });
        const notice = {
            isUrgent: !!data.notice?.isUrgent ?? false,
            isWarranty: !!data.notice?.isWarranty ?? false,
        };
        if (notice.isUrgent && !existingLabelUrgent) {
            this.labels.push(Label.URGENT);
        }
        if (notice.isWarranty && !existingLabelWarranty) {
            this.labels.push(Label.WARRANTY);
        }
        return this;
    }
    toData() {
        return {
            _id: U.trimId(this.id),
            time: this.timestamp?.time ?? null,
            username: U.trimId(this.username),
            nameOfUser: U.trimText(this.name),
            state: this.state,
            customer: this.customer?.toData(),
            description: U.trimText(this.description),
            belongings: this.belongings.map((belonging) => belonging.toData()),
            events: this._events.map((event) => event.toData()),
            imageFiles: this.imageFiles.map((image) => image.toData()),
            labels: this.labels.map((label) => label.toData()),
        };
    }
    toCount(strs) {
        const { customer, timestamp, state: stateKey, description } = this;
        const state = State.findByKey(stateKey);
        const stateTitle = state?.title ?? "";
        const ts = [
            "service",
            description,
            stateTitle,
            ...this.labels.map((label) => label.title),
        ];
        let count = strs.reduce((count, str) => {
            for (const t of ts)
                if (textContains(t, str))
                    count++;
            return count;
        }, 0) +
            this._events.reduce((count, event) => count + event.toCount(strs), 0);
        if (timestamp?.toCount(strs))
            count++;
        if (customer?.toCount(strs))
            count += 5;
        return count;
    }
    get events() {
        const serviceData = this.toData();
        const serviceEvent = new ServiceEvent(this.stores).fromData({
            method: ServiceEventMethod.INITIAL.key,
            time: serviceData.time,
            username: serviceData.username,
            name: serviceData.nameOfUser,
            description: serviceData.description,
            images: serviceData.imageFiles,
        });
        return [serviceEvent, ...this._events].sort((event1, event2) => {
            return event1.compare(event2);
        });
    }
    set events(events) {
        this._events = events.filter((event) => {
            return event.timestamp?.time !== this.timestamp?.time;
        });
    }
    getUnique() {
        return this.id;
    }
    isUrgent() {
        return !!this.labels.find((label) => label.isEqual(Label.URGENT));
    }
    isWarranty() {
        return !!this.labels.find((label) => {
            return label.isEqual(Label.WARRANTY);
        });
    }
    compare(item) {
        let value = 0;
        if (value === 0)
            value = this.compareState(item);
        if (value === 0)
            value = this.compareTimestamp(item);
        return value;
    }
    compareState(item) {
        return State.indexOfKey(this.state) - State.indexOfKey(item.state);
    }
    compareTimestamp(item) {
        if (this.timestamp && item.timestamp)
            return this.timestamp.compare(item.timestamp);
        if (this.timestamp || !item.timestamp)
            return -1;
        if (!this.timestamp || item.timestamp)
            return 1;
        return 0;
    }
    compareCustomer(item) {
        if (this.customer && item.customer)
            return this.customer.compare(item.customer);
        if (this.customer || !item.customer)
            return -1;
        if (!this.customer || item.customer)
            return 1;
        return 0;
    }
    compareTotalPrice(item) {
        const totalPrice1 = this.toTotalPrice();
        const totalPrice2 = item.toTotalPrice();
        return totalPrice1.compare(totalPrice2);
    }
    async fetchUser() {
        if (!U.isString(this.username) || this.username.trim().length === 0) {
            return null;
        }
        return await this.userStore.dispatch("getUserByUsername", this.username);
    }
    async fetchName() {
        const user = await this.fetchUser();
        const username = user?.username ?? "";
        if (username.length && this.name)
            return `${this.name}(${username})`;
        if (!username.length && this.name)
            return this.name;
        if (username.length && !this.name)
            return username;
        throw new Error("unknown");
    }
    toTotalPrice() {
        return this._events.reduce((cost, event) => {
            if (event.price && event.method === Method.PURCHASE.key) {
                cost = cost.plus(event.price);
            }
            return cost;
        }, new ServicePrice().fromData({ amount: 0 }));
    }
    setLabels(labels = []) {
        this.labels = U.optArray(labels)
            .map((label) => new Label().fromData(label.toData()))
            .filter((label) => label.title.trim().length > 0);
    }
    addLabel(label) {
        const labels = this.labels;
        const existingLabel = labels.find((l) => l.isEqual(label));
        if (!existingLabel) {
            this.setLabels([...labels, label]);
        }
    }
    removeLabel(label) {
        const labels = this.labels;
        const existingLabel = labels.find((l) => l.isEqual(label));
        if (existingLabel) {
            this.setLabels(labels.filter((l) => !l.isEqual(label)));
        }
    }
    setUrgent(bool = false) {
        U.optBoolean(bool)
            ? this.addLabel(Label.URGENT)
            : this.removeLabel(Label.URGENT);
    }
    setWarranty(bool = false) {
        U.optBoolean(bool)
            ? this.addLabel(Label.WARRANTY)
            : this.removeLabel(Label.WARRANTY);
    }
}
