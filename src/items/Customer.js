import ModuleCustomer from "./data/Customer.js";
import PhoneNumber from "./PhoneNumber.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

import U from "@/U.js";

class Customer {
	stores = null;
	customerStore = null;

	constructor(stores) {
		this.stores = stores;
		this.customerStore = stores.customer;
	}

	id = "";
	name = "";
	phoneNumber = "";
	description = "";
	deviceIds = [];

	fromData(data) {
		data = ModuleCustomer.trim(data);
		this.id = data._id;
		this.name = data.name;
		this.phoneNumber = data.phoneNumber
			? new PhoneNumber(this.stores).fromData(data.phoneNumber)
			: null;
		this.description = U.optString(data.description);
		this.deviceIds = U.optArray(data.deviceIds);
		return this;
	}
	toData() {
		return {
			_id: this.id,
			name: this.name,
			phoneNumber: this.phoneNumber ? this.phoneNumber.toData() : "",
			description: this.description,
			deviceIds: this.deviceIds.map((deviceId) => deviceId),
		};
	}
	toCount(strs) {
		let count = strs.reduce((count, str) => {
			count += textContains("customer", str) ? 1 : 0;
			count += textContains(this.name, str) ? 1 : 0;
			count += textContains(this.phoneNumber, str) ? 1 : 0;
			count += textContains(this.description, str) ? 1 : 0;
			return count;
		}, 0);

		return count;
	}

	compare(item) {
		return 0;
	}

	async fetchDevices() {
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
			optGroup(groups, device[property]).devices.push(device);
			return groups;
		}, []);
	}
}

export default Customer;