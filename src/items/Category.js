import Image from "./Image";
import ModuleCategory from "./data/Category";
import ItemSearcher from "../objects/ItemSearcher.js";
import U from "@/U";
const textContains = ItemSearcher.textContains;

class CategoryBackground extends Image {
   static TABLET = new Image().fromData({
      method: "local",
      path: "res/background/daniel-romero--cCxgKIA5RA-unsplash-w300h100.webp",
   });
   static NOTEBOOK = new Image().fromData({
      method: "local",
      path: "res/background/andras-vas-Bd7gNnWJBkU-unsplash-w300h100.webp",
   });
   static DESKTOP = new Image().fromData({
      method: "local",
      path: "res/background/niclas-illg-wzVQp_NRIHg-unsplash-w300h100.webp",
   });
   static PRINTER = new Image().fromData({
      method: "local",
      path: "res/background/mahrous-houses-5AoOejjRUrA-unsplash-w300h100.webp",
   });
   static CARTRIDGE = new Image().fromData({
      method: "local",
      path: "res/background/177364729-w300h100.webp",
   });
   static MOUSE = new Image().fromData({
      method: "local",
      path: "res/background/ryan-putra-j4PqlNVZ4Bc-unsplash-w300h100.webp",
   });
   static KEYBOARD = new Image().fromData({
      method: "local",
      path: "res/background/girl-with-red-hat-Z6SXt1v5tP8-unsplash-w300h100.webp",
   });
   static AUDIO = new Image().fromData({
      method: "local",
      path: "res/background/josh-sorenson-u8-QI4tRES0-unsplash-w300h100.webp",
   });
   static MONITOR = new Image().fromData({
      method: "local",
      path: "res/background/monitor-u3223qe-gallery-3-w300h100.webp",
   });
   static WEBCAM = new Image().fromData({
      method: "local",
      path: "res/background/emiliano-cicero-lq87UxGSiEQ-unsplash-w300h100.webp",
   });
   static CCTV = new Image().fromData({
      method: "local",
      path: "res/background/michal-jakubowski-oQD9uq4Rd4I-unsplash-w300h100.webp",
   });
   static STORAGE = new Image().fromData({
      method: "local",
      path: "res/background/denny-muller-1qL31aacAPA-unsplash-w300h100.webp",
   });
   static RAM = new Image().fromData({
      method: "local",
      path: "res/background/harrison-broadbent-ING1Uf1Fc30-unsplash-w300h100.webp",
   });
   static NETWORK = new Image().fromData({
      method: "local",
      path: "res/background/jordan-harrison-40XgDxBfYXM-unsplash-w300h100.webp",
   });
   static OTHER = new Image().fromData({
      method: "local",
      path: "res/background/christopher-bill-3l19r5EOZaw-unsplash-w300h100.webp",
   });
}

const getBackground = (key) => {
   switch (key) {
      case ModuleCategory.Key.Tablet:
         return CategoryBackground.TABLET;
      case ModuleCategory.Key.Notebook:
         return CategoryBackground.NOTEBOOK;
      case ModuleCategory.Key.Desktop:
         return CategoryBackground.DESKTOP;
      case ModuleCategory.Key.Printer:
         return CategoryBackground.PRINTER;
      case ModuleCategory.Key.Cartridge:
         return CategoryBackground.CARTRIDGE;
      case ModuleCategory.Key.Mouse:
         return CategoryBackground.MOUSE;
      case ModuleCategory.Key.Keyboard:
         return CategoryBackground.KEYBOARD;
      case ModuleCategory.Key.Audio:
         return CategoryBackground.AUDIO;
      case ModuleCategory.Key.Monitor:
         return CategoryBackground.MONITOR;
      case ModuleCategory.Key.Webcam:
         return CategoryBackground.WEBCAM;
      case ModuleCategory.Key.Cctv:
         return CategoryBackground.CCTV;
      case ModuleCategory.Key.Storage:
         return CategoryBackground.STORAGE;
      case ModuleCategory.Key.Ram:
         return CategoryBackground.RAM;
      case ModuleCategory.Key.Network:
         return CategoryBackground.NETWORK;
      case ModuleCategory.Key.Other:
         return CategoryBackground.OTHER;
      default:
         return null;
   }
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
         icon: this.icon?.toData() ?? {},
         background: this.background?.toData() ?? {},
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
