import Vuex from "vuex";
import HostApi from "@/host/HostApi.js";
import ProductSpecType from "@/items/ProductSpecType";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

const requestList = async () => HostApi.request().url("spec/").send();

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await requestList();
      const error = api.getError();
      if (error) throw new Error(error);
      return U.optArray(api.getContent()).map((content) => {
         return new ProductSpecType(Stores).fromData(content);
      });
   });
   context.onGetStore(() => Stores.specification);
   context.onIdProperty("key");
   context.build();
   context.actions.refresh = async (context) => {
      return context.state.processor.acquire("refresh", async () => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      });
   };
   context.actions.getItems = async (context) => {
      return context.state.processor.acquire("getItems", async () => {
         return context.state.dataLoader.data();
      });
   };
   context.actions.getItemOfKey = async (context, key = "") => {
      return context.state.processor.acquire("getItemOfKey", async () => {
         const items = await context.dispatch("getItems");
         return items.find((item) => item.key === key);
      });
   };

   return new Vuex.Store(context);
};

export default { init };
