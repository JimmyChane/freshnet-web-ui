import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ItemPs2Disc from "../items/Ps2Disc.js";
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
						const api = await ApiHost.request().url("ps2/disc/").send();
						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error(error);
						const contents = Array.isArray(content) ? content : [];
						const items = contents.map((content) => {
							return new ItemPs2Disc(Stores).fromData(content);
						});
						return items.sort((a, b) => a.compare(b));
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
				items: (state) => state.items,
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
			},
		});

		return store;
	},
};
