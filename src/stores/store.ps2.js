import Vuex from "vuex";
import ItemPs2Disc from "../items/Ps2Disc.js";
import StoreBuilder from "./tools/StoreBuilder.js";
import Ps2Request from "@/request/Ps2";

const init = (Stores) => {
   const context = new StoreBuilder()
      .onFetchItems(async () => {
         return (await Ps2Request.listDisc())
            .optArrayContent()
            .map((content) => new ItemPs2Disc(Stores).fromData(content))
            .sort((a, b) => a.compare(b));
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
