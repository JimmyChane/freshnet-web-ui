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
      const api = await SettingRequest.update(setting);
      const content = api.getObjectContent();

      context.state.list.updateItemById(content.key, (item) => {
         item.value = content.value;
      });

      return context.state.list.items;
   });
   context.action("findItemOfKey", async (context, arg = { key: "" }) => {
      const items = await context.dispatch("getItems");
      return items.find((item) => item.key === arg.key);
   });
   context.action("findValueOfKey", async (context, arg = { key: "", default: "" }) => {
      const item = await context.dispatch("findItemOfKey", { key: arg.key });
      return item ? item.value : arg.default;
   });

   return new Vuex.Store(context.build());
};

export default { init };
