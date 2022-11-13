import DataLoader from "./tools/DataLoader";
import CollectionUpdater from "./tools/CollectionUpdater";
import Processor from "./tools/Processor.js";

import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ItemCustomerDevice from "../items/CustomerDevice.js";

const apiThenContent = (api) => {
	let error = api.getError();
	let friendlyError = api.getErrorFriendly();

	if (error) throw new Error(error);
	if (friendlyError) throw new Error(friendlyError);
	return api.getContent();
};
const updateThenItem = (context, id, callback) => {
	const items = context.state.items;
	const item = items.find((item) => item.id === id);
	callback(item);
	context.commit("items", items);
	context.commit("lastModified", Date.now());
	return item;
};
const getItemOfId = async (context, id = "") => {
	return context.state.processor.acquire("getItemOfId", async () => {
		if (typeof id !== "string") return null;
		const items = await context.dispatch("getItems");
		const item = items.find((item) => item.id === id);
		return item ? item : null;
	});
};
const getItemsOfIds = async (context, ids = []) => {
	return context.state.processor.acquire("getItemsOfIds", async () => {
		if (!U.isArray(ids)) return [];

		const items = await context.dispatch("getItems");
		const results = ids.map((id) => {
			const item = items.find((item) => item.id === id);
			return item ? item : null;
		});
		return results;
	});
};

export default {
	init(Stores) {
		const deviceStore = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => deviceStore.state.processor)
					.loadData(async () => {
						let api = await ApiHost.request()
							.url("customer/device/list")
							.send();
						let content = apiThenContent(api);
						let contents = Array.isArray(content) ? content : [];
						let items = contents.map((content) => {
							return new ItemCustomerDevice(Stores).fromData(content);
						});
						return items;
					})
					.setData((data) => {
						deviceStore.commit("items", Array.isArray(data) ? data : []);
						deviceStore.commit("lastModified", Date.now());
					})
					.getData(() => deviceStore.getters.items),
				items: [],
				processor: new Processor(),
			},
			mutations: {
				lastModified: (state, time) => (state.lastModified = time),
				items: (state, items) => (state.items = items),
			},
			getters: {
				lastModified: (state) => state.lastModified,
				isLoading: (state) => state.processor.isLoading(),
				items: (state) => state.items,
			},
			actions: {
				async refresh(context) {
					return context.state.processor.acquire("refresh", async () => {
						context.state.dataLoader.doTimeout();
						await context.dispatch("getItems");
					});
				},

				async getItems(context) {
					return context.state.processor.acquire("getItems", async () => {
						return context.state.dataLoader.data();
					});
				},
				async getItemOfId(context, id = "") {
					return getItemOfId(context, id);
				},
				async getItemsOfIds(context, ids = []) {
					return getItemsOfIds(context, ids);
				},

				async addItem(context, arg = {}) {
					return context.state.processor.acquire("addItem", async () => {
						let data = new ItemCustomerDevice(Stores).fromData(arg).toData();
						delete data.id;
						let api = await ApiHost.request()
							.POST()
							.url("customer/device/add")
							.body({ content: data })
							.send();
						let content = apiThenContent(api);
						let item = new ItemCustomerDevice(Stores).fromData(content);
						item = new CollectionUpdater(context)
							.onId((item) => item.id)
							.getItem(item);
						let customer = Stores.customer.getters.customers.find(
							(customer) => {
								return customer.id === item.ownerCustomerId;
							},
						);
						if (customer) customer.deviceIds.push(item.id);
						return item;
					});
				},
				async removeItemOfId(context, arg = {}) {
					return context.state.processor.acquire("removeItemById", async () => {
						let api = await ApiHost.request()
							.DELETE()
							.url("customer/device/remove")
							.body({
								content: {
									ownerCustomerId: arg.ownerCustomerId,
									deviceId: arg.id,
								},
							})
							.send();
						let content = apiThenContent(api);
						let item = new ItemCustomerDevice(Stores).fromData(content);
						let customer = Stores.customer.getters.customers.find(
							(customer) => {
								return customer.id === item.ownerCustomerId;
							},
						);
						customer.deviceIds = customer.deviceIds.filter((deviceId) => {
							return deviceId !== item.id;
						});
						let items = context.state.items;
						items = items.filter((existing) => existing.id !== item.id);
						context.commit("items", items);
						context.commit("lastModified", Date.now());
						return item;
					});
				},

				async updateSpecificationsOfId(context, arg = { _id, specifications }) {
					return context.state.processor.acquire(
						"updateSpecificationsOfId",
						async () => {
							let { _id, specifications } = arg;
							let api = await ApiHost.request()
								.PUT()
								.url("customer/device/update/specifications")
								.body({ content: { _id, specifications } })
								.send();
							let content = apiThenContent(api);
							let item = new ItemCustomerDevice(Stores).fromData(content);
							item = updateThenItem(context, item.id, (itemNow) => {
								return (itemNow.specifications = item.specifications);
							});
							return item;
						},
					);
				},
				async updateDescriptionOfId(context, arg = { _id, description }) {
					return context.state.processor.acquire(
						"updateDescriptionOfId",
						async () => {
							let { _id, description } = arg;
							let api = await ApiHost.request()
								.PUT()
								.url("customer/device/update/description")
								.body({ content: { _id, description } })
								.send();
							let content = apiThenContent(api);
							let item = new ItemCustomerDevice(Stores).fromData(content);
							item = updateThenItem(context, item.id, (itemNow) => {
								return (itemNow.description = item.description);
							});
							return item;
						},
					);
				},
			},
		});

		return deviceStore;
	},
};
