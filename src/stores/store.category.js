import Vuex from "vuex";
import Category from "@/items/Category.js";
import CategoryRequest from "@/request/Category";
import StoreBuilder from "./tools/StoreBuilder";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await CategoryRequest.list();
      return api
         .optArrayContent()
         .map((content) => new Category(Stores).fromData(content));
   });
   context.onGetStore(() => Stores.category);

   context.action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
   });
   context.action("getItems", async (context) => {
      return context.state.dataLoader.data();
   });
   context.action("getItemOfId", async (context, id = "") => {
      const items = await context.dispatch("getItems");
      return items.find((item) => item.id === id);
   });
   context.action("getItemOfKey", async (context, key = "") => {
      const items = await context.dispatch("getItems");
      return items.find((item) => item.key === key);
   });

   return new Vuex.Store(context.build());
};

export default { init };
