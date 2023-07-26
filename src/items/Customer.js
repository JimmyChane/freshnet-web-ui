import PhoneNumber from "./PhoneNumber";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
const textContains = ItemSearcher.textContains;
export default class Customer {
    static Requirement = {
        name: { isRequired: true },
        phoneNumber: { isRequired: false },
        description: { isRequired: false },
        deviceIds: { isRequired: false },
    };
    stores = null;
    customerStore = null;
    constructor(stores) {
        this.stores = stores;
        this.customerStore = stores.customer;
    }
    id = "";
    name = "";
    phoneNumber = null;
    description = "";
    deviceIds = [];
    cachedServices = [];
    cachedOrders = [];
    get services() {
        return this.cachedServices;
    }
    get orders() {
        return this.cachedOrders;
    }
    fromData(data) {
        this.id = U.trimId(data._id);
        this.name = U.trimText(data.name);
        const phoneNumber = U.trimText(data.phoneNumber);
        this.phoneNumber = phoneNumber
            ? new PhoneNumber(this.stores).fromData({ value: phoneNumber })
            : null;
        this.description = U.trimText(data.description);
        this.deviceIds = U.optArray(data.deviceIds)
            .map((deviceId) => U.trimId(deviceId))
            .filter((deviceId) => !!deviceId);
        return this;
    }
    toData() {
        return {
            _id: U.trimId(this.id),
            name: U.trimText(this.name),
            phoneNumber: this.phoneNumber?.toData().value ?? "",
            description: U.trimText(this.description),
            deviceIds: this.deviceIds.map((deviceId) => deviceId),
        };
    }
    toCount(strs) {
        let count = strs.reduce((count, str) => {
            if (textContains("customer", str))
                count++;
            if (textContains(this.name, str))
                count++;
            if (textContains(this.phoneNumber?.toString() ?? "", str))
                count++;
            if (textContains(this.description, str))
                count++;
            return count;
        }, 0);
        return count;
    }
    isFromStoreCustomer() {
        return !!this.id;
    }
    isModifiable() {
        return this.isFromStoreCustomer();
    }
    compare(item) {
        return 0;
    }
    async fetchDevices() {
        if (!this.deviceIds.length)
            return [];
        const devices = await this.customerStore.dispatch("getDevices");
        return this.deviceIds.map((deviceId) => {
            return devices.find((device) => device.id === deviceId);
        });
    }
    async fetchDeviceGroups(property = "") {
        const devices = await this.fetchDevices();
        const optGroup = (groups, key) => {
            let group = groups.find((group) => group[property] === key);
            if (!group) {
                group = { devices: [] };
                group[property] = key;
                groups.push(group);
            }
            return group;
        };
        return devices.reduce((groups, device) => {
            if (!device)
                return groups;
            const deviceValue = device[property];
            optGroup(groups, deviceValue).devices.push(device);
            return groups;
        }, []);
    }
}
