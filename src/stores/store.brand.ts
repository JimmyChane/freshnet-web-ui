import Vuex from "vuex";
import Brand from "@/items/Brand.js";
import BrandRequest from "@/request/Brand";
import StoreBuilder from "./tools/StoreBuilder";

const init = (Stores: any) => {
  const context = new StoreBuilder<Brand>()
    .onFetchItems(async () => {
      const api = await BrandRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => new Brand(Stores).fromData(content));
    })
    .onGetStore(() => Stores.brand)
    .action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
    })
    .action("getItems", async (context) => {
      return context.state.dataLoader.data();
    })
    .action("getItemOfId", async (context, id = "") => {
      let items: Brand[] = await context.dispatch("getItems");
      return items.find((item) => item.id === id);
    })
    .build();

  return new Vuex.Store(context);
};

export default { init };
