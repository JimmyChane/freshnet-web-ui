import Vuex from "vuex";
import ProductSpecType from "@/items/ProductSpecType";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import SpecificationRequest from "@/request/Specification";

const init = (Stores: any) => {
  const context = new StoreBuilder()
    .onFetchItems(async () => {
      const api = await SpecificationRequest.list();
      const content: any[] = api.optArrayContent();

      return content.map((content) => {
        return new ProductSpecType(Stores).fromData(content);
      });
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
      const items: ProductSpecType[] = await context.dispatch("getItems");
      return items.find((item) => item.key === key);
    })
    .build();

  return new Vuex.Store(context);
};

export default { init };
