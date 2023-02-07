import Vuex from "vuex";
import HostApi from "@/host/HostApi.js";
import Category from "@/items/Category.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

const requestApi = () => HostApi.request().url("productv2/category/list/");

export default {
   init(Stores) {
      const context = new StoreBuilder().onFetchItems(async () => {
         const api = await requestApi().send();
         const error = api.getError();
         if (error) throw new Error(error);
         return U.optArray(api.getContent()).map((content) => {
            return new Category(Stores).fromData(content);
         });
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
   },
};
