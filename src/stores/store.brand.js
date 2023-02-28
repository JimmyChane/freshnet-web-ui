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

   context.action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
   });
   context.action("getItems", async (context) => {
      return context.state.dataLoader.data();
   });
   context.action("getItemOfId", async (context, id = "") => {
      let items = await context.dispatch("getItems");
      return items.find((item) => item.id === id);
   });

   return new Vuex.Store(context.build());
};

export default { init };
