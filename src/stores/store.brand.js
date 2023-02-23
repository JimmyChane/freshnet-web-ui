import Vuex from "vuex";
import HostApi from "@/host/HostApi.js";
import Brand from "@/items/Brand.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

const requestApi = () => HostApi.request().url("brand/");

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await requestApi().send();
      const error = api.getError();
      if (error) throw new Error(error);
      return U.optArray(api.getContent()).map((content) => {
         return new Brand(Stores).fromData(content);
      });
   });
   context.onGetStore(() => Stores.brand);
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
   context.actions.getItemOfId = async (context, id = "") => {
      return context.state.processor.acquire("getItemOfId", async () => {
         let items = await context.dispatch("getItems");
         return items.find((item) => item.id === id);
      });
   };

   return new Vuex.Store(context);
};

export default { init };
