import Vuex from "vuex";
import ProductSpecType from "@/items/ProductSpecType";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import SpecificationRequest from "@/request/Specification";

const init = (Stores) => {
   const context = new StoreBuilder()
      .onFetchItems(async () => {
         return (await SpecificationRequest.list())
            .optArrayContent()
            .map((content) => new ProductSpecType(Stores).fromData(content));
      })
      .onGetStore(() => Stores.specification)
      .onIdProperty("key")
      .action("refresh", async (context) => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      })
      .action("getItems", async (context) => {
         return context.state.dataLoader.data();
      })
      .action("getItemOfKey", async (context, key = "") => {
         const items = await context.dispatch("getItems");
         return items.find((item) => item.key === key);
      })
      .build();

   return new Vuex.Store(context);
};

export default { init };
