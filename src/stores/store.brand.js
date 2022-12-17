import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import DataLoader from "./tools/DataLoader";
import Brand from "@/items/Brand.js";
import Processor from "./tools/Processor.js";
import U from "@/U";

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => store.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url("brand/").send();
						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error(error);
						const items = U.optArray(content).map((content) => {
							return new Brand(Stores).fromData(content);
						});
						return items;
					})
					.setData((data) => {
						store.commit("items", U.optArray(data));
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
				items: (state) => U.optArray(state.items),
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
				getItemOfId: async (context, id = "") => {
					return context.state.processor.acquire("getItemOfId", async () => {
						let items = await context.dispatch("getItems");
						return items.find((item) => item.id === id);
					});
				},
			},
		});

		return store;
	},
};
