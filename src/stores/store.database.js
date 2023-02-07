import Vuex from "vuex";
import HostApi from "@/host/HostApi.js";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";

const requestInfo = async () => {
   return HostApi.request().POST().url("database/info").send();
};
const requestDatabases = async () => {
   return HostApi.request().POST().url("database/databases").send();
};
const requestCollections = async (database) => {
   return HostApi.request()
      .POST()
      .url(`database/database/${database}/collections`)
      .send();
};
const requestDocuments = async (database, collection) => {
   return HostApi.request()
      .POST()
      .url(`database/database/${database}/collection/${collection}/documents`)
      .send();
};
const requestImport = async (body) => {
   return HostApi.request().POST().url("database/imports").body(body).send();
};
const requestExport = async (database) => {
   return HostApi.request().url(`database/database/${database}/exportv2`).send();
};

export default {
   init(Stores) {
      const store = new Vuex.Store({
         state: {
            lastModified: 0,
            dataLoader: new DataLoader({ timeout: 1000 * 5 }) // 5sec
               .processor(() => store.state.processor)
               .loadData(async () => {
                  const api = await requestInfo();
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
            refresh: async (context) => {
               return context.state.processor.acquire("refresh", async () => {
                  context.state.dataLoader.doTimeout();
                  await context.dispatch("loadBaseInfo");
               });
            },

            loadBaseInfo: async (context) => {
               return context.state.processor.acquire("loadBaseInfo", async () => {
                  return context.state.dataLoader.data();
               });
            },
            loadDatabases: async (context) => {
               return context.state.processor.acquire("loadDatabases", async () => {
                  try {
                     context.commit("items", []);
                     context.commit("lastModified", Date.now());
                     const api = await requestDatabases();
                     const content = api.getContent();
                     const items = content.map((database) => {
                        return { name: database, collections: [] };
                     });
                     context.commit("items", items);
                     for (const database of items) {
                        context.dispatch("loadCollections", { database: database.name });
                     }
                     return context.getters.items;
                  } catch (error) {
                     context.commit("items", []);
                     context.commit("lastModified", Date.now());
                     throw error;
                  }
               });
            },
            loadCollections: async (context, arg = {}) => {
               return context.state.processor.acquire("loadCollections", async () => {
                  const { database } = arg;
                  const api = await requestCollections(database);
                  const content = api.getContent();
                  const collections = content.map((collection) => {
                     return { name: collection, documents: [] };
                  });
                  const dbFound = await context.dispatch("findDatabase", {
                     database,
                  });
                  while (dbFound.collections.length) {
                     dbFound.collections.splice(0, dbFound.collections.length);
                  }
                  dbFound.collections.push(...collections);
                  for (const collection of dbFound.collections) {
                     const arg = { database: dbFound.name, collection: collection.name };
                     context.dispatch("loadDocuments", arg);
                  }
                  return dbFound.collections;
               });
            },
            loadDocuments: async (context, arg = {}) => {
               return context.state.processor.acquire("loadDocuments", async () => {
                  const { database, collection } = arg;
                  const api = await requestDocuments(database, collection);
                  const documents = api.getContent();
                  const outputArg = { database, collection };
                  const collectionFound = await context.dispatch(
                     "findCollection",
                     outputArg,
                  );
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

            imports: async (context, arg = {}) => {
               return context.state.processor.acquire("imports", async () => {
                  const { json } = arg;
                  const api = await requestImport({ content: json });
                  throw new Error();
               });
            },
            exportDatabase: async (context, arg = {}) => {
               return context.state.processor.acquire("exportDatabase", async () => {
                  const { database } = arg;
                  const api = await requestExport(database);
                  return api.getContent();
               });
            },

            findDatabase: async (context, arg = {}) => {
               return context.state.processor.acquire("findDatabase", async () => {
                  const { database } = arg;
                  const dbFound = context.state.items.find((db) => {
                     return db.name === database;
                  });
                  if (!dbFound) throw new Error("database not found");

                  return dbFound;
               });
            },
            findCollection: async (context, arg = {}) => {
               return context.state.processor.acquire("findCollection", async () => {
                  const { database, collection } = arg;
                  const dbFound = await context.dispatch("findDatabase", {
                     database,
                  });
                  const collectionFound = dbFound.collections.find((dbCollection) => {
                     return dbCollection.name === collection;
                  });
                  if (!collectionFound) throw new Error("collection not found");

                  return collectionFound;
               });
            },
         },
      });

      return store;
   },
};
