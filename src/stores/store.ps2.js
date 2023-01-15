import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ItemPs2Disc from "../items/Ps2Disc.js";
import U from "@/U.js";
import StoreBuilder from "./tools/StoreBuilder.js";

const requestList = async () => {
   return ApiHost.request().url("ps2/disc/").send();
};

export default {
   init(Stores) {
      const context = new StoreBuilder().onFetchItems(async () => {
         const api = await requestList();
         const error = api.getError();
         if (error) throw new Error(error);
         return U.optArray(api.getContent())
            .map((content) => new ItemPs2Disc(Stores).fromData(content))
            .sort((a, b) => a.compare(b));
      });
      context.onGetStore(() => Stores.ps2);
      context.build();
      context.actions = {
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
      };

      return new Vuex.Store(context);
   },
};
