import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ItemPs2Disc from "../items/Ps2Disc.js";
import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";
import List from "./tools/List.js";
import U from "@/U.js";

export default {
   init(Stores) {
      const store = new Vuex.Store({
         state: {
            dataLoader: DataLoader.withStore(() => store).loadData(async () => {
               const api = await ApiHost.request().url("ps2/disc/").send();
               const error = api.getError();
               if (error) throw new Error(error);
               return U.optArray(api.getContent())
                  .map((content) => new ItemPs2Disc(Stores).fromData(content))
                  .sort((a, b) => a.compare(b));
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
         },
      });

      return store;
   },
};
