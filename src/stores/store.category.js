import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import Category from "@/items/Category.js";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";
import U from "@/U";
import List from "./tools/List";

export default {
   init(Stores) {
      const store = new Vuex.Store({
         state: {
            dataLoader: DataLoader.withStore(() => store).loadData(async () => {
               const api = await ApiHost.request().url("productv2/category/list/").send();
               const error = api.getError();
               if (error) throw new Error(error);
               return U.optArray(api.getContent()).map((content) => {
                  return new Category(Stores).fromData(content);
               });
            }),
            processor: new Processor(),
            list: new List(),
         },
         getters: {
            isLoading: (state) => state.processor.isLoading(),
            lastModified: (state) => state.list.lastModified,
            items: (state) => state.list.items,
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
                  const items = await context.dispatch("getItems");
                  return items.find((item) => item.id === id);
               });
            },
            getItemOfKey: async (context, key = "") => {
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
