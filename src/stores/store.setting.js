import Vuex from "vuex";
import SettingModule from "@/items/data/Setting.js";
import StoreBuilder from "./tools/StoreBuilder";
import SettingRequest from "@/request/Setting";
import Contact from "@/items/Contact";

const init = (Stores) => {
   const context = new StoreBuilder()
      .onFetchItems(async () => {
         const api = await SettingRequest.list();
         const list = api.optArrayContent();
         const items = list.map((content) => new SettingModule(content));

         const trimmedItems = items.filter((item) => {
            return item.key !== SettingModule.Key.Contacts;
         });

         const contacts = [
            new Contact(Stores).fromData({
               title: "Beh Aik Keong",
               links: [
                  { category: "call", id: "0167959444" },
                  { category: "whatsapp", id: "0167959444" },
               ],
            }),
            new Contact(Stores).fromData({
               title: "Office (Mobile)",
               links: [
                  { category: "call", id: "0146315353" },
                  { category: "whatsapp", id: "0146315353" },
                  { category: "telegram", id: "FreshnetEnterprise" },
               ],
            }),
            new Contact(Stores).fromData({
               title: "Office",
               links: [{ category: "telephone", id: "0332897297" }],
            }),
            // new Contact(Stores).fromData({
            //    title: "Office",
            //    links: [{ category: "telephone", id: "0332811526" }],
            // }),
         ];
         trimmedItems.push(
            new SettingModule({
               key: SettingModule.Key.Contacts,
               visibility: SettingModule.Visibility.Protected,
               value: contacts,
            }),
         );

         return trimmedItems;
      })
      .onGetStore(() => Stores.setting)
      .onIdProperty("key")
      .action("refresh", async (context) => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      })
      .action("getItems", async (context) => {
         return context.state.dataLoader.data();
      })
      .action("updateItem", async (context, arg = { key: "", value }) => {
         const { key, value } = arg;

         if (key === SettingModule.Key.Contacts) {
            throw new Error("testing");
         }

         const setting = new SettingModule({ key, value });
         const api = await SettingRequest.update(setting);
         const content = api.getObjectContent();

         context.state.list.updateItemById(content.key, (item) => {
            item.value = content.value;
         });

         return context.state.list.items;
      })
      .action("findItemOfKey", async (context, arg = { key: "" }) => {
         const { key } = arg;
         const items = await context.dispatch("getItems");
         return items.find((item) => item.key === key);
      })
      .action(
         "findValueOfKey",
         async (context, arg = { key: "", default: "" }) => {
            const { key = "", default: defaultValue = "" } = arg;
            const item = await context.dispatch("findItemOfKey", { key });
            return item?.value ?? defaultValue;
         },
      )
      .build();

   return new Vuex.Store(context);
};

export default { init };
