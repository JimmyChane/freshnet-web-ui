import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";

const urlCollections = (database) =>
	`database/database/${database}/collections`;
const urlDocuments = (database, collection) =>
	`database/database/${database}/collection/${collection}/documents`;
const urlImports = () => `database/imports`;

export default {
	init(Stores) {
		const store = new Vuex.Store({
			state: {
				lastModified: 0,
				dataLoader: new DataLoader({ timeout: 1000 * 5 }) // 5sec
					.processor(() => store.state.processor)
					.loadData(async () => {
						const api = await ApiHost.request()
							.POST()
							.url("database/info")
							.send();
						const baseInfo = api.getContent();
						store.dispatch("loadDatabases");
						return baseInfo;
					})
					.setData((data) => {
						store.commit("baseInfo", data ? data : null);
						store.commit("lastModified", Date.now());
					})
					.getData(() => store.getters.baseInfo),
				baseInfo: null,
				items: [],
				processor: new Processor(),
			},
			mutations: {
				lastModified: (state, time) => (state.lastModified = time),
				baseInfo: (state, baseInfo) => (state.baseInfo = baseInfo),
				items: (state, items) => (state.items = items),
			},
			getters: {
				lastModified: (state) => state.lastModified,
				isLoading: (state) => state.processor.isLoading(),
				baseInfo: (state) => state.baseInfo,
				items: (state) => state.items,
			},
			actions: {
				async refresh(context) {
					return context.state.processor.acquire("refresh", async () => {
						context.state.dataLoader.doTimeout();
						await context.dispatch("loadBaseInfo");
					});
				},

				async loadBaseInfo(context) {
					return context.state.processor.acquire("loadBaseInfo", async () => {
						return context.state.dataLoader.data();
					});
				},
				async loadDatabases(context) {
					return context.state.processor.acquire("loadDatabases", async () => {
						try {
							context.commit("items", []);
							context.commit("lastModified", Date.now());
							let api = await ApiHost.request()
								.POST()
								.url("database/databases")
								.send();
							let content = api.getContent();
							let items = content.map((database) => {
								return { name: database, collections: [] };
							});
							context.commit("items", items);
							for (let database of items) {
								context.dispatch("loadCollections", {
									database: database.name,
								});
							}
							return context.getters.items;
						} catch (error) {
							context.commit("items", []);
							context.commit("lastModified", Date.now());
							throw error;
						}
					});
				},
				async loadCollections(context, arg = {}) {
					return context.state.processor.acquire(
						"loadCollections",
						async () => {
							let { database } = arg;
							let api = await ApiHost.request()
								.POST()
								.url(urlCollections(database))
								.send();
							let content = api.getContent();
							let collections = content.map((collection) => {
								return { name: collection, documents: [] };
							});
							let dbFound = await context.dispatch("findDatabase", {
								database,
							});
							while (dbFound.collections.length) {
								dbFound.collections.splice(0, dbFound.collections.length);
							}
							dbFound.collections.push(...collections);
							for (let collection of dbFound.collections) {
								context.dispatch("loadDocuments", {
									database: dbFound.name,
									collection: collection.name,
								});
							}
							return dbFound.collections;
						},
					);
				},
				async loadDocuments(context, arg = {}) {
					return context.state.processor.acquire("loadDocuments", async () => {
						let { database, collection } = arg;
						let api = await ApiHost.request()
							.POST()
							.url(urlDocuments(database, collection))
							.send();
						let documents = api.getContent();
						const collectionFound = await context.dispatch("findCollection", {
							database,
							collection,
						});
						while (collectionFound.documents.length) {
							collectionFound.documents.splice(
								0,
								collectionFound.documents.length,
							);
						}
						collectionFound.documents.push(...documents);
						return collectionFound.documents;
					});
				},

				async imports(context, arg = {}) {
					return context.state.processor.acquire("imports", async () => {
						let { json } = arg;
						let api = await ApiHost.request()
							.POST()
							.url(urlImports())
							.body({ content: json })
							.send();
						throw new Error();
					});
				},
				async exportDatabase(context, arg = {}) {
					return context.state.processor.acquire("exportDatabase", async () => {
						let { database } = arg;
						let api = await ApiHost.request()
							.url(`database/database/${database}/exportv2`)
							.send();
						let content = api.getContent();
						return content;
					});
				},

				async findDatabase(context, arg = {}) {
					return context.state.processor.acquire("findDatabase", async () => {
						let { database } = arg;
						const dbFound = context.state.items.find((db) => {
							return db.name === database;
						});
						if (!dbFound) throw new Error("database not found");

						return dbFound;
					});
				},
				async findCollection(context, arg = {}) {
					return context.state.processor.acquire("findCollection", async () => {
						let { database, collection } = arg;
						let dbFound = await context.dispatch("findDatabase", {
							database,
						});
						let collectionFound = dbFound.collections.find((dbCollection) => {
							return dbCollection.name === collection;
						});
						if (!collectionFound) {
							throw new Error("collection not found");
						}
						return collectionFound;
					});
				},
			},
		});

		return store;
	},
};
