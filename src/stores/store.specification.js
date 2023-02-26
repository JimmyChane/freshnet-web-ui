import Vuex from "vuex";
import ProductSpecType from "@/items/ProductSpecType";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import SpecificationRequest from "@/request/Specification";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await SpecificationRequest.list();
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
