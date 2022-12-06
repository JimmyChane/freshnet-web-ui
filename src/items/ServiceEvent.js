import ServiceTimestamp from "./ServiceTimestamp";
import ServicePrice from "./ServicePrice.js";

import ModuleEvent from "./data/ServiceEvent.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

import U from "@/U.js";

class ServiceEvent {
	stores = null;
	userStore = null;

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

	fromData(data) {
		data = new ModuleEvent(data);
		this.timestamp = new ServiceTimestamp(data.time);
		this.username = data.username;
		this.name = data.nameOfUser;
		this.method = data.method;
		this.description = data.description;
		this.status = data.status;
		this.price = data.price ? new ServicePrice().fromData(data.price) : null;
		return this;
	}
	toData() {
		return new ModuleEvent({
			time: this.timestamp.time,
			username: this.username,
			nameOfUser: this.name,
			method: this.method,
			description: this.description,
			status: this.status,
			price: this.price ? this.price.toData() : null,
		});
	}
	toCount(strs) {
		let count = strs.reduce((count, str) => {
			count += textContains("event", str) ? 1 : 0;
			count += textContains(this.username, str) ? 1 : 0;
			count += textContains(this.name, str) ? 1 : 0;
			count += textContains(this.method, str) ? 1 : 0;
			count += textContains(this.description, str) ? 1 : 0;
			count += textContains(this.status, str) ? 1 : 0;
			return count;
		}, 0);
		count += this.timestamp ? this.timestamp.toCount(strs) : 0;

		return count;
	}

	compare(item) {
		return item.timestamp.time - this.timestamp.time;
	}

	async fetchUser() {
		if (!U.isString(this.username) || this.username.trim().length === 0)
			return null;
		return await this.userStore.dispatch("getUserByUsername", this.username);
	}
	async fetchName() {
		const user = await this.fetchUser();
		const username = user ? user.username : "";

		if (username.length && this.name) return `${this.name}(${username})`;
		if (!username.length && this.name) return this.name;
		if (username.length && !this.name) return username;

		throw new Error("unknown");
	}

	isQuotation() {
		return this.method === ModuleEvent.Method.Quotation;
	}
	isPurchase() {
		return this.method === ModuleEvent.Method.Purchase;
	}
	isInfo() {
		return this.method === ModuleEvent.Method.Info;
	}

	toResult() {
		if (this.isQuotation() || this.isPurchase()) return this.price;
		if (this.isInfo()) return this.status;
		return null;
	}
}

export default ServiceEvent;
