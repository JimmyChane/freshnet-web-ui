import Vuex from "vuex";
import SettingModule from "@/items/data/Setting.js";
import StoreBuilder from "./tools/StoreBuilder";
import SettingRequest from "@/request/Setting";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await SettingRequest.list();
      const error = api.getError();
      const content = api.getContent();
      if (error) throw new Error(error);
      if (content === undefined || content === null) throw new Error("content not valid");
      const contents = Array.isArray(content) ? content : [];
      const settings = contents.map((content) => new SettingModule(content));
      return settings;
   });
   context.onGetStore(() => Stores.setting);
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
   context.actions.updateItem = async (context, arg = { key: "", value }) => {
      return context.state.processor.acquire("updateItem", async () => {
         const { key, value } = arg;
         const setting = new SettingModule({ key, value });
         const api = SettingRequest.update(setting);
         const error = api.getError();
         const content = api.getContent();
         if (error) throw new Error();
         if (content === undefined || content === null) {
            throw new Error("content not valid");
         }

         let { items } = context.state;
         let item = items.find((item) => item.key === content.key);

         if (item) {
            item.value = content.value;
         } else {
            item = content;
            items.push(item);
         }

         context.commit("items", items);
         context.commit("lastModified", Date.now());
         return context.getters.items;
      });
   };

   return new Vuex.Store(context);
};

export default { init };
