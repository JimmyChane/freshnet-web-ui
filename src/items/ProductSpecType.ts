import Image from "./Image";
import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
const textContains = ItemSearcher.textContains;

export default class ProductSpecType {
  static Key = {
    Processor: "processor",
    Ram: "ram",
    Size: "size",
    Storage: "storage",
    Resolution: "resolution",
    Display: "display",
    Monitor: "monitor",
    Graphic: "graphic",

    Keyboard: "keyboard",
    Backlight: "backlight",
    Stylus: "stylus",
    Camera: "camera",
    Battery: "battery",

    Speed: "speed",
    Wifi: "wifi",
    Bluetooth: "bluetooth",

    Print: "print",
    Scan: "scan",
    Paper: "paper",
    Ink: "ink",
    Connectivity: "connectivity",

    Colour: "colour",
    Os: "os",
  };

  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = "";
  key: string = "";
  title: string = "";
  icon: Image | null = null;
  color: string = "";

  fromData(data: {
    _id?: string;
    key?: string;
    title?: string;
    icon?: any;
    color?: string;
  }): ProductSpecType {
    this.id = U.trimId(data._id || "");
    this.key = U.trimId(data.key || "");
    this.title = U.trimText(data.title || "");
    this.icon = U.isObjectOnly(data.icon)
      ? new Image().fromData(data.icon)
      : null;
    this.color = U.trimId(data.color || "");

    return this;
  }
  toData(): {
    _id: string;
    key: string;
    title: string;
    icon: any;
    color: string;
  } {
    return {
      _id: U.trimId(this.id),
      key: U.trimId(this.key),
      title: U.trimText(this.title),
      icon: this.icon?.toData() ?? {},
      color: U.trimId(this.color),
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.key, str)) count++;
      if (textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  compare(item: ProductSpecType): number {
    return 0;
  }
}
