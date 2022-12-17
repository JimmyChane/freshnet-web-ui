import DataLoader from "./tools/DataLoader";
import CollectionUpdater from "./tools/CollectionUpdater";
import Processor from "./tools/Processor.js";

import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ItemCustomer from "../items/Customer.js";
import DeviceStore from "./store.device.js";
import U from "@/U";

const apiThenContent = (api) => {
	let error = api.getError();
	let friendlyError = api.getErrorFriendly();

	if (error) throw new Error(error);
	if (friendlyError) throw new Error(friendlyError);
	return api.getContent();
};
const getItemOfId = async (context, id = "") => {
	return context.state.processor.acquire("getItemOfId", async () => {
		if (!U.isString(id)) return null;
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
		const deviceStore = DeviceStore.init(Stores);

		const customerStore = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => customerStore.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url("customer/list").send();
						const content = apiThenContent(api);
						const items = U.optArray(content).map((content) => {
							return new ItemCustomer(Stores).fromData(content);
						});
						return items;
					})
					.setData((data) => {
						customerStore.commit("items", U.optArray(data));
						customerStore.commit("lastModified", Date.now());
					})
					.getData(() => customerStore.getters.items),
				items: [],
				processor: new Processor(),
			},
			mutations: {
				lastModified: (state, time) => (state.lastModified = time),
				items: (state, items) => (state.items = items),
			},
			getters: {
				lastModified: (state) => state.lastModified,
				isLoading: (state) => {
					return state.processor.isLoading() || deviceStore.getters.isLoading;
				},
				items: (state) => state.items,

				// legacy

				devices: () => deviceStore.getters.items,
			},
			actions: {
				refresh: async (context) => {
					await context.state.processor.acquire("refresh", async () => {
						context.state.dataLoader.doTimeout();
						await context.dispatch("getItems");
					});
					await deviceStore.dispatch("refresh");
				},

				getItems: async (context) => {
					return context.state.processor.acquire("getItems", async () => {
						return context.state.dataLoader.data();
					});
				},
				getItemOfId: async (context, id = "") => {
					return getItemOfId(context, id);
				},
				getItemsOfIds: async (context, ids = []) => {
					return getItemsOfIds(context, ids);
				},

				generateCustomersAcross: async (context) => {
					const customers = (await context.dispatch("getItems")).map((customer) => {
						customer = new ItemCustomer(Stores).fromData(customer.toData());
						customer.services = [];
						customer.orders = [];

						return customer;
					});
					const optCustomer = (eCustomer) => {
						let customer = customers.find((customer) => {
							const eName = U.optString(customer.name);
							const ePhoneNumber = customer.phoneNumber;
							const ePhoneNumberValue = ePhoneNumber ? ePhoneNumber.value : "";

							const name = U.optString(eCustomer.name);
							const phoneNumber = eCustomer.phoneNumber;
							const phoneNumberValue = phoneNumber ? phoneNumber.value : "";

							return eName === name && ePhoneNumberValue === phoneNumberValue;
						});

						if (!customer) {
							customer = new ItemCustomer(Stores).fromData(eCustomer.toData());
							customer.services = [];
							customer.orders = [];
							customers.push(customer);
						}

						return customer;
					};

					const serviceGroups = await Stores.service.dispatch("getGroupsByCustomer");
					const orderGroups = await Stores.order.dispatch("getGroupsByCustomer");
					for (const serviceGroup of serviceGroups) {
						optCustomer(serviceGroup.customer).services.push(...serviceGroup.items);
					}
					for (const orderGroup of orderGroups) {
						optCustomer(orderGroup.customer).orders.push(...orderGroup.items);
					}

					return customers;
				},

				addItem: async (context, arg = {}) => {
					return context.state.processor.acquire("addItem", async () => {
						const data = new ItemCustomer(Stores).fromData(arg).toData();
						delete data.id;
						const api = await ApiHost.request()
							.POST()
							.url("customer/add")
							.body({ content: data })
							.send();
						const content = apiThenContent(api);
						return new CollectionUpdater(context)
							.toAdd()
							.withItem(new ItemCustomer(Stores).fromData(content))
							.commitThenGetItem();
					});
				},
				removeItemOfId: async (context, arg = { _id }) => {
					return context.state.processor.acquire("removeItemOfId", async () => {
						const { _id } = arg;
						const api = await ApiHost.request()
							.DELETE()
							.url("customer/remove")
							.body({ content: { _id } })
							.send();
						const content = apiThenContent(api);
						return new CollectionUpdater(context)
							.toRemove()
							.withItem(new ItemCustomer(Stores).fromData(content))
							.commitThenGetItem();
					});
				},

				updateNamePhoneNumberOfId: async (context, arg = { _id, name, phoneNumber }) => {
					return context.state.processor.acquire(
						"updateNamePhoneNumberOfItemId",
						async () => {
							const { _id, name, phoneNumber } = arg;
							const api = await ApiHost.request()
								.PUT()
								.url("customer/update/namePhoneNumber")
								.body({ content: { _id, name, phoneNumber } })
								.send();
							const content = apiThenContent(api);

							return new CollectionUpdater(context)
								.toUpdate()
								.withItem(new ItemCustomer(Stores).fromData(content))
								.updateThenCommitThenGetItem((oldItem, newItem) => {
									oldItem.name = newItem.name;
									oldItem.phoneNumber = newItem.phoneNumber;
								});
						},
					);
				},
				updateDescriptionOfId: async (context, arg = { _id, description }) => {
					return context.state.processor.acquire("updateDescriptionOfId", async () => {
						const { _id, description } = arg;
						const api = await ApiHost.request()
							.PUT()
							.url("customer/update/description")
							.body({ content: { _id, description } })
							.send();
						const content = apiThenContent(api);
						return new CollectionUpdater(context)
							.toUpdate()
							.withItem(new ItemCustomer(Stores).fromData(content))
							.updateThenCommitThenGetItem((oldItem, newItem) => {
								oldItem.description = newItem.description;
							});
					});
				},

				// legacy

				getDevices: () => deviceStore.dispatch("getItems"),
				getDeviceById: (context, id) => deviceStore.dispatch("getItemOfId", id),
				getDevicesByIds: (context, ids) => deviceStore.dispatch("getItemsOfIds", ids),
				addDevice: (context, arg) => deviceStore.dispatch("addItem", arg),
				removeDevice: (context, arg) => deviceStore.dispatch("removeItemOfId", arg),
				updateDeviceSpecifications: (context, arg) =>
					deviceStore.dispatch("updateSpecificationsOfId", arg),
				updateDeviceDescription: (context, arg) =>
					deviceStore.dispatch("updateDescriptionOfId", arg),
			},
		});

		return customerStore;
	},
};
