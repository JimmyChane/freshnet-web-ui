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
         const items = await context.dispatch("getItems");
         return items.find((item) => item.id === id);
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
