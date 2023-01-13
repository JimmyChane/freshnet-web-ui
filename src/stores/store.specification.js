import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ProductSpecType from "@/items/ProductSpecType";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";
import List from "./tools/List";
import U from "@/U";

export default {
   init(Stores) {
      const store = new Vuex.Store({
         state: {
            dataLoader: DataLoader.withStore(() => store).loadData(async () => {
               const api = await ApiHost.request().url("spec/").send();
               const error = api.getError();
               if (error) throw new Error(error);
               return U.optArray(api.getContent()).map((content) => {
                  return new ProductSpecType(Stores).fromData(content);
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
