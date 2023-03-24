import Image from "./Image";
import ModuleCategory from "./data/Category";
import ItemSearcher from "../objects/ItemSearcher.js";
import U from "@/U";
const textContains = ItemSearcher.textContains;

const getBackground = (key) => {
   switch (key) {
      case ModuleCategory.Key.Tablet:
         return new Image().fromData({
            method: "local",
            path: "res/background/daniel-romero--cCxgKIA5RA-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Notebook:
         return new Image().fromData({
            method: "local",
            path: "res/background/andras-vas-Bd7gNnWJBkU-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Desktop:
         return new Image().fromData({
            method: "local",
            path: "res/background/niclas-illg-wzVQp_NRIHg-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Printer:
         return new Image().fromData({
            method: "local",
            path: "res/background/mahrous-houses-5AoOejjRUrA-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Cartridge:
         return new Image().fromData({
            method: "local",
            path: "res/background/177364729-w300h100.webp",
         });
      case ModuleCategory.Key.Mouse:
         return new Image().fromData({
            method: "local",
            path: "res/background/ryan-putra-j4PqlNVZ4Bc-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Keyboard:
         return new Image().fromData({
            method: "local",
            path: "res/background/girl-with-red-hat-Z6SXt1v5tP8-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Audio:
         return new Image().fromData({
            method: "local",
            path: "res/background/josh-sorenson-u8-QI4tRES0-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Monitor:
         return new Image().fromData({
            method: "local",
            path: "res/background/monitor-u3223qe-gallery-3-w300h100.webp",
         });
      case ModuleCategory.Key.Webcam:
         return new Image().fromData({
            method: "local",
            path: "res/background/emiliano-cicero-lq87UxGSiEQ-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Cctv:
         return new Image().fromData({
            method: "local",
            path: "res/background/michal-jakubowski-oQD9uq4Rd4I-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Storage:
         return new Image().fromData({
            method: "local",
            path: "res/background/denny-muller-1qL31aacAPA-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Ram:
         return new Image().fromData({
            method: "local",
            path: "res/background/harrison-broadbent-ING1Uf1Fc30-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Network:
         return new Image().fromData({
            method: "local",
            path: "res/background/jordan-harrison-40XgDxBfYXM-unsplash-w300h100.webp",
         });
      case ModuleCategory.Key.Other:
         return new Image().fromData({
            method: "local",
            path: "res/background/christopher-bill-3l19r5EOZaw-unsplash-w300h100.webp",
         });
   }
   return null;
};

class Category {
   static Key = ModuleCategory.Key;

   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   id = "";
   key = "";
   title = "";
   icon = null;
   background = null;

   fromData(data) {
      data = ModuleCategory.trim(data);

      this.id = data._id;
      this.key = data.key;
      this.title = data.title;
      this.icon = U.isObject(data.icon)
         ? new Image().fromData(data.icon)
         : null;
      this.background = getBackground(this.key);

      return this;
   }
   toData() {
      return {
         _id: this.id,
         key: this.key,
         title: this.title,
         icon: this.icon ? this.icon.toData() : {},
         background: this.background ? this.background.toData() : {},
      };
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (this.title === "Notebook")
            count += textContains("Laptop", str) ? 1 : 0;
         if (this.title === "Notebook" && textContains("Laptop", str)) count++;
         if (textContains(this.title, str)) count++;
         if (textContains("category", str)) count++;
         return count;
      }, 0);
   }

   compare(item) {
      const keyOrder = Object.keys(ModuleCategory.Key).map((key) => {
         return ModuleCategory.Key[key];
      });

      let index1 = keyOrder.indexOf(this.key);
      let index2 = keyOrder.indexOf(item.key);
      index1 = index1 == -1 ? keyOrder.length : index1;
      index2 = index2 == -1 ? keyOrder.length : index2;

      return index1 > index2 ? 1 : index1 < index2 ? -1 : 0;
   }
}

export default Category;
