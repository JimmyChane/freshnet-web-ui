import Vuex from "vuex";
import Brand from "@/items/Brand.js";
import BrandRequest from "@/request/Brand";
import StoreBuilder from "./tools/StoreBuilder";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await BrandRequest.list();
      return api.optArrayContent().map((content) => new Brand(Stores).fromData(content));
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
