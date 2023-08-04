import Vuex from "vuex";
import ItemPs2Disc from "../items/Ps2Disc";
import StoreBuilder from "./tools/StoreBuilder";
import Ps2Request from "@/request/Ps2";

const init = (Stores: any) => {
  const context = new StoreBuilder()
    .onFetchItems(async () => {
      const api = await Ps2Request.listDisc();
      const content: any[] = api.optArrayContent();
      const items = content.map((content) => {
        return new ItemPs2Disc(Stores).fromData(content);
      });
      return items.sort((a, b) => a.compare(b));
    })
    .onGetStore(() => Stores.ps2)
    .action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
    })
    .action("getItems", async (context) => {
      return context.state.dataLoader.data();
    })
    .build();

  return new Vuex.Store(context);
};

export default { init };
