import Vuex, { Store } from "vuex";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";
import DatabaseRequest from "@/request/Database";

const init = (Stores: any) => {
  const store: Store<any> = new Vuex.Store({
    state: {
      lastModified: 0,
      dataLoader: new DataLoader({ timeout: 1000 * 5 }) // 5sec
        .processor(() => store.state.processor)
        .loadData(async () => {
          const api = await DatabaseRequest.info();
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
            const api = await DatabaseRequest.databases();
            const items = api.optArrayContent().map((database: any) => {
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
          const api = await DatabaseRequest.collections(database);
          const collections = api.optArrayContent().map((collection: any) => {
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
          const api = await DatabaseRequest.documents(database, collection);
          const documents = api.optArrayContent();
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
          const api = await DatabaseRequest.import({ content: json });
          throw new Error();
        });
      },
      exportDatabase: async (context, arg = {}) => {
        return context.state.processor.acquire("exportDatabase", async () => {
          const { database } = arg;
          return (await DatabaseRequest.export(database)).getContent();
        });
      },

      findDatabase: async (context, arg = {}) => {
        return context.state.processor.acquire("findDatabase", async () => {
          const { database } = arg;
          const dbFound = context.state.items.find((db: { name: string }) => {
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
          const collectionFound = dbFound.collections.find(
            (dbCollection: { name: string }) => {
              return dbCollection.name === collection;
            },
          );
          if (!collectionFound) throw new Error("collection not found");

          return collectionFound;
        });
      },
    },
  });

  return store;
};

export default { init };
