import Vuex from "vuex";
import Category from "@/items/Category";
import CategoryRequest from "@/request/Category";
import StoreBuilder from "./tools/StoreBuilder";

const init = (Stores: any) => {
  const context = new StoreBuilder<Category>()
    .onFetchItems(async () => {
      const api = await CategoryRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => new Category(Stores).fromData(content));
    })
    .onGetStore(() => Stores.category)

    .action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
    })
    .action("getItems", async (context) => {
      return context.state.dataLoader.data();
    })
    .action("getItemOfId", async (context, id = "") => {
      const items: Category[] = await context.dispatch("getItems");
      return items.find((item) => item.id === id);
    })
    .action("getItemOfKey", async (context, key = "") => {
      const items: Category[] = await context.dispatch("getItems");
      return items.find((item) => item.key === key);
    })
    .build();

  return new Vuex.Store(context);
};

export default { init };
