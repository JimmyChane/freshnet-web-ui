import Vuex from "vuex";
import ItemPs2Disc from "../items/Ps2Disc.js";
import StoreBuilder from "./tools/StoreBuilder.js";
import Ps2Request from "@/request/Ps2";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      return (await Ps2Request.listDisc())
         .optArrayContent()
         .map((content) => new ItemPs2Disc(Stores).fromData(content))
         .sort((a, b) => a.compare(b));
   });
   context.onGetStore(() => Stores.ps2);
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

   return new Vuex.Store(context);
};

export default { init };
