import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ProductSpecType from "@/items/ProductSpecType";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
					.processor(() => store.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url("spec/").send();
						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error(error);
						const contents = Array.isArray(content) ? content : [];
						const items = contents.map((content) => {
							return new ProductSpecType(Stores).fromData(content);
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
				async getItemOfKey(context, key = "") {
					return context.state.processor.acquire("getItemOfKey", async () => {
						const items = await context.dispatch("getItems");
						return items.find((item) => item.key === key);
					});
				},
			},
		});

		return store;
	},
};
