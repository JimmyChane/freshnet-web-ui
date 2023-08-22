import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
import { Item } from "@/stores/tools/List";
import Image from "./Image";

export class Type implements Item {
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
  }): Type {
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
      if (ItemSearcher.textContains(this.key, str)) count++;
      if (ItemSearcher.textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Type): number {
    return 0;
  }

  getUnique(): string {
    return this.id;
  }
}

export default class Specification {
  stores: any;
  specificationStore: any;

  typeKey: string = "";
  type: Type | null = null;
  content: string = "";

  constructor(stores: any) {
    this.stores = stores;
    this.specificationStore = stores.specification;
  }

  fromData(data: { key?: string; content?: string }): Specification {
    this.typeKey = U.trimId(data.key);
    this.content = U.trimText(data.content);
    this.fetchType();

    return this;
  }
  toData(): { key: string | undefined; content: string } {
    return {
      key: this.getKey(),
      content: this.content,
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (ItemSearcher.textContains(this.content, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Specification): number {
    return 0;
  }

  async fetchType(): Promise<Type | null> {
    if (this.type instanceof Type) return this.type;

    const specifications: Type[] = await this.specificationStore.dispatch(
      "getItems",
    );
    const specification = specifications.find((specification) => {
      return specification.key == this.typeKey;
    });
    this.type = specification ?? null;
    return this.type;
  }

  getKey(): string {
    if (this.type instanceof Type) {
      return this.type.key;
    }
    if (typeof this.type === "string") {
      return this.typeKey;
    }
    return "";
  }
}