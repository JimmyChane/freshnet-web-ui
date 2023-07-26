import Image from "./Image";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
import HostApi from "@/host/HostApi";

class CategoryBackground extends Image {
  static TABLET = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/daniel-romero--cCxgKIA5RA-unsplash-w300h100.webp",
    ),
  });
  static NOTEBOOK = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/andras-vas-Bd7gNnWJBkU-unsplash-w300h100.webp",
    ),
  });
  static DESKTOP = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/niclas-illg-wzVQp_NRIHg-unsplash-w300h100.webp",
    ),
  });
  static PRINTER = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/mahrous-houses-5AoOejjRUrA-unsplash-w300h100.webp",
    ),
  });
  static CARTRIDGE = new Image().fromData({
    method: "link",
    path: HostApi.res("background/177364729-w300h100.webp"),
  });
  static MOUSE = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/ryan-putra-j4PqlNVZ4Bc-unsplash-w300h100.webp",
    ),
  });
  static KEYBOARD = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/girl-with-red-hat-Z6SXt1v5tP8-unsplash-w300h100.webp",
    ),
  });
  static AUDIO = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/josh-sorenson-u8-QI4tRES0-unsplash-w300h100.webp",
    ),
  });
  static MONITOR = new Image().fromData({
    method: "link",
    path: HostApi.res("background/monitor-u3223qe-gallery-3-w300h100.webp"),
  });
  static WEBCAM = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/emiliano-cicero-lq87UxGSiEQ-unsplash-w300h100.webp",
    ),
  });
  static CCTV = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/michal-jakubowski-oQD9uq4Rd4I-unsplash-w300h100.webp",
    ),
  });
  static STORAGE = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/denny-muller-1qL31aacAPA-unsplash-w300h100.webp",
    ),
  });
  static RAM = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/harrison-broadbent-ING1Uf1Fc30-unsplash-w300h100.webp",
    ),
  });
  static NETWORK = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/jordan-harrison-40XgDxBfYXM-unsplash-w300h100.webp",
    ),
  });
  static OTHER = new Image().fromData({
    method: "link",
    path: HostApi.res(
      "background/christopher-bill-3l19r5EOZaw-unsplash-w300h100.webp",
    ),
  });

  static getBackground(key: string): Image | null {
    switch (key) {
      case Category.Key.Tablet:
        return CategoryBackground.TABLET;
      case Category.Key.Notebook:
        return CategoryBackground.NOTEBOOK;
      case Category.Key.Desktop:
        return CategoryBackground.DESKTOP;
      case Category.Key.Printer:
        return CategoryBackground.PRINTER;
      case Category.Key.Cartridge:
        return CategoryBackground.CARTRIDGE;
      case Category.Key.Mouse:
        return CategoryBackground.MOUSE;
      case Category.Key.Keyboard:
        return CategoryBackground.KEYBOARD;
      case Category.Key.Audio:
        return CategoryBackground.AUDIO;
      case Category.Key.Monitor:
        return CategoryBackground.MONITOR;
      case Category.Key.Webcam:
        return CategoryBackground.WEBCAM;
      case Category.Key.Cctv:
        return CategoryBackground.CCTV;
      case Category.Key.Storage:
        return CategoryBackground.STORAGE;
      case Category.Key.Ram:
        return CategoryBackground.RAM;
      case Category.Key.Network:
        return CategoryBackground.NETWORK;
      case Category.Key.Other:
        return CategoryBackground.OTHER;
      default:
        return null;
    }
  }
}

interface CategoryData {
  _id: string;
  key: string;
  title: string;
  icon?: any;
  background?: any;
}

export default class Category {
  static Key = {
    Tablet: "tablet",
    Notebook: "laptop",
    Desktop: "desktopComputer",
    Printer: "printer",
    Cartridge: "cartridge",
    Mouse: "mouse",
    Keyboard: "keyboard",
    Audio: "audio",
    Monitor: "monitor",
    Webcam: "webcam",
    Cctv: "cctv-camera",
    Storage: "storage",
    Ram: "ram",
    Network: "network",
    Charger: "charger",
    Other: "other",
  };

  stores: any = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = "";
  key: string = "";
  title: string = "";
  icon: Image | null = null;
  background: Image | null = null;

  fromData(data: CategoryData): this {
    this.id = U.trimId(data._id);
    this.key = U.trimId(data.key);
    this.title = U.trimStringAll(data.title);
    this.icon = U.isObject(data.icon) ? new Image().fromData(data.icon) : null;
    this.background = CategoryBackground.getBackground(this.key);

    return this;
  }

  toData(): CategoryData {
    return {
      _id: this.id,
      key: this.key,
      title: this.title,
      icon: this.icon?.toData() ?? {},
      background: this.background?.toData() ?? {},
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (this.title === "Notebook")
        count += ItemSearcher.textContains("Laptop", str) ? 1 : 0;
      if (this.title === "Notebook" && ItemSearcher.textContains("Laptop", str))
        count++;
      if (ItemSearcher.textContains(this.title, str)) count++;
      if (ItemSearcher.textContains("category", str)) count++;
      return count;
    }, 0);
  }

  compare(item: Category): number {
    const keyOrders = Object.values(Category.Key);

    let index1 = keyOrders.indexOf(this.key);
    let index2 = keyOrders.indexOf(item.key);
    index1 = index1 == -1 ? keyOrders.length : index1;
    index2 = index2 == -1 ? keyOrders.length : index2;

    return index1 > index2 ? 1 : index1 < index2 ? -1 : 0;
  }
}
