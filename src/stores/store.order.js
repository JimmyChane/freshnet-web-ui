import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import Order from "@/items/Order.js";

import DataLoader from "./tools/DataLoader";
import CollectionUpdater from "./tools/CollectionUpdater";
import Processor from "./tools/Processor.js";

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => store.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url("order/").send();
						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error(error);
						const contents = Array.isArray(content) ? content : [];
						const items = contents.map((data) => {
							return new Order(Stores).fromData(data);
						});
						return items;
					})
					.setData((data) => {
						store.commit("items", Array.isArray(data) ? data : []);
						store.commit("lastModified", Date.now());
					})
					.getData(() => store.getters.items),
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
				items: (state) => (Array.isArray(state.items) ? state.items : []),
			},
			actions: {
				refresh: async (context) => {
					return context.state.processor.acquire("refresh", async () => {
						context.state.dataLoader.doTimeout();
						await context.dispatch("getItems");
					});
				},

				getItems: async (context) => {
					return context.state.processor.acquire("getItems", async () => {
						return context.state.dataLoader.data();
					});
				},

				getGroupsByCustomer: async (context) => {
					const items = await context.dispatch("getItems");
					const groups = items.reduce((groups, item) => {
						let group = groups.find((group) => {
							return group.customer.isEqual(item.customer);
						});

						if (!group) {
							group = { customer: item.customer, items: [] };
							groups.push(group);
						}

						group.items.push(item);
						return groups;
					}, []);

					return groups;
				},
				getGroupsByStatus: async (context) => {
					const items = await context.dispatch("getItems");
					const groups = items.reduce((groups, item) => {
						let group = groups.find((group) => group.status === item.status);

						if (!group) {
							group = { status: item.status, items: [] };
							groups.push(group);
						}

						group.items.push(item);
						return groups;
					}, []);

					return groups;
				},

				addItem: async (context, arg = { data }) => {
					return context.state.processor.acquire("addItem", async () => {
						let { data } = arg;
						if (!data) return null;
						let api = await ApiHost.request().POST().url("order/").body(data).send();
						let error = api.getError();
						let content = api.getContent();
						if (error) throw new Error();

						return new CollectionUpdater(context)
							.toAdd()
							.withItem(new Order().fromData(content))
							.commitThenGetItem();
					});
				},
				removeOItemOfId: async (context, arg = { id }) => {
					return context.state.processor.acquire("removeOItemOfId", async () => {
						let { id } = arg;
						let api = await ApiHost.request().DELETE().url("order/").body({ id }).send();
						let error = api.getError();
						if (error) throw new Error();
						new CollectionUpdater(context).toRemove().withId(id).commitThenGetItem();
					});
				},
				updateStatusOfId: async (context, arg = { id, status }) => {
					return context.state.processor.acquire("updateStatusOfId", async () => {
						let { id, status } = arg;
						let api = await ApiHost.request()
							.PUT()
							.url("order/")
							.body({ id, status })
							.send();
						let error = api.getError();
						if (error) throw new Error();

						return new CollectionUpdater(context)
							.toUpdate()
							.withId(id)
							.updateThenCommitThenGetItem((oldItem, newItem) => {
								oldItem.status = status;
							});
					});
				},
				updateToPendingOfId: async (context, id = "") => {
					return context.dispatch("updateStatusOfId", {
						id,
						status: Order.STATUS.PENDING,
					});
				},
				updateToCompletedOfId: async (context, id = "") => {
					return context.dispatch("updateStatusOfId", {
						id,
						status: Order.STATUS.PENDING,
					});
				},
			},
		});

		return store;
	},
};
