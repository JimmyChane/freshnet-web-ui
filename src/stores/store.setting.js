import Vuex from "vuex";
import SettingModule from "@/items/data/Setting.js";
import StoreBuilder from "./tools/StoreBuilder";
import SettingRequest from "@/request/Setting";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      return (await SettingRequest.list())
         .optArrayContent()
         .map((content) => new SettingModule(content));
   });
   context.onGetStore(() => Stores.setting);
   context.onIdProperty("key");
   context.action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
   });
   context.action("getItems", async (context) => {
      return context.state.dataLoader.data();
   });
   context.action("updateItem", async (context, arg = { key: "", value }) => {
      const { key, value } = arg;
      const setting = new SettingModule({ key, value });
      const api = SettingRequest.update(setting);
      const content = api.getObjectContent();

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

   return new Vuex.Store(context.build());
};

export default { init };
