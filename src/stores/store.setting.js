import Vuex from "vuex";
import SettingModule from "@/items/data/Setting.js";
import StoreBuilder from "./tools/StoreBuilder";
import SettingRequest from "@/request/Setting";
import Contact from "@/items/Contact";
import WorkingDay from "@/items/WorkingDay";

const isPredefinedSetting = (key) => {
   return [
      SettingModule.Key.Contacts,
      SettingModule.Key.CompanyName,
      SettingModule.Key.CompanyCategory,
      SettingModule.Key.CompanyWorkingHours,
   ].includes(key);
};

const init = (Stores) => {
   const context = new StoreBuilder()
      .onFetchItems(async () => {
         const api = await SettingRequest.list();
         const list = api.optArrayContent();
         const items = list.map((content) => new SettingModule(content));

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
         const days = [];
         days.push(
            ...[
               new WorkingDay(null, days).fromData({
                  title: "Monday",
                  timeStart: "0900",
                  timeEnd: "1900",
               }),
               new WorkingDay(null, days).fromData({
                  title: "Tuesday",
                  timeStart: "0900",
                  timeEnd: "1900",
               }),
               new WorkingDay(null, days).fromData({
                  title: "Wednesday",
                  timeStart: "0900",
                  timeEnd: "1900",
               }),
               new WorkingDay(null, days).fromData({
                  title: "Thursday",
                  timeStart: "0900",
                  timeEnd: "1900",
               }),
               new WorkingDay(null, days).fromData({
                  title: "Friday",
                  timeStart: "0900",
                  timeEnd: "1900",
               }),
               new WorkingDay(null, days).fromData({
                  title: "Saturday",
                  timeStart: "0900",
                  timeEnd: "1900",
               }),
               new WorkingDay(null, days).fromData({
                  title: "Sunday",
                  timeStart: "1000",
                  timeEnd: "1830",
               }),
            ],
         );

         return [
            ...items.filter((item) => !isPredefinedSetting(item.key)),
            new SettingModule({
               key: SettingModule.Key.CompanyWorkingHours,
               visibility: SettingModule.Visibility.Protected,
               value: days,
            }),
            new SettingModule({
               key: SettingModule.Key.Contacts,
               visibility: SettingModule.Visibility.Protected,
               value: contacts,
            }),
            new SettingModule({
               key: SettingModule.Key.CompanyName,
               visibility: SettingModule.Visibility.Protected,
               value: "Freshnet Enterprise",
            }),
            new SettingModule({
               key: SettingModule.Key.CompanyCategory,
               visibility: SettingModule.Visibility.Protected,
               value: "Computer Store",
            }),
         ];
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

         if (isPredefinedSetting(key)) throw new Error("testing");

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
