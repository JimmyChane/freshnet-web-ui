import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";
import SettingModule from "@/items/data/Setting.js";

const api_url = "settingv3";

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 5 }) // 5sec
					.processor(() => store.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request().url(api_url).send();
						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error(error);
						if (content === undefined || content === null)
							throw new Error("content not valid");
						const contents = Array.isArray(content) ? content : [];
						const settings = contents.map(
							(content) => new SettingModule(content),
						);
						return settings;
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
				async updateItem(context, arg = { key: "", value }) {
					if (api_url === "settingv3") {
						return context.dispatch("updateItemV2", arg);
					}

					return context.state.processor.acquire("updateItem", async () => {
						const { key, value, visibility } = arg;
						const setting = new SettingModule({ key, value, visibility });

						const api = await ApiHost.request()
							.PUT()
							.url(
								api_url === "settingv3"
									? `${api_url}/system`
									: `${api_url}/key/${setting.key}`,
							)
							.body(api_url === "settingv3" ? setting : { content: setting })
							.send();

						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error();
						if (content === undefined || content === null) {
							throw new Error("content not valid");
						}

						let { items } = context.state;
						let item = items.find((item) => item.key === content.key);

						if (item) {
							item.value = content.value;
						} else {
							item = content;
							items.push(item);
						}

						context.commit("items", items);
						context.commit("lastModified", Date.now());
						return context.getters.items;
					});
				},
				async updateItemV2(context, arg = { key: "", value }) {
					return context.state.processor.acquire("updateItemV2", async () => {
						const { key, value } = arg;
						const setting = new SettingModule({ key, value });

						const api = await ApiHost.request()
							.PUT()
							.url(`${api_url}/system`)
							.body(setting)
							.send();

						const error = api.getError();
						const content = api.getContent();
						if (error) throw new Error();
						if (content === undefined || content === null) {
							throw new Error("content not valid");
						}

						let { items } = context.state;
						let item = items.find((item) => item.key === content.key);

						if (item) {
							item.value = content.value;
						} else {
							item = content;
							items.push(item);
						}

						context.commit("items", items);
						context.commit("lastModified", Date.now());
						return context.getters.items;
					});
				},
			},
		});

		return store;
	},
};
