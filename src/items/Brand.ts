import Image from "./Image";
import ItemSearcher from "../objects/ItemSearcher";

import { Item } from "@/stores/tools/List";
import { isObjectOnly, trimId, trimText } from "@/U";

interface BrandData {
  _id: string;
  title: string;
  icon?: any;
}

export default class Brand implements Item {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = "";
  title: string = "";
  icon: Image | null = null;

  fromData(data: BrandData): this {
    this.id = trimId(data._id);
    this.title = trimText(data.title);
    this.icon = isObjectOnly(data.icon)
      ? new Image().fromData(data.icon)
      : null;
    return this;
  }

  toData(): BrandData {
    return {
      _id: this.id,
      title: this.title,
      icon: this.icon?.toData() ?? {},
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (ItemSearcher.textContains(this.title, str)) count++;
      if (ItemSearcher.textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  isEqual(obj: Brand): boolean {
    return this.id === obj.id && this.title === obj.title;
  }

  compare(item: Brand): number {
    return this.title.localeCompare(item.title);
  }

  getUnique(): string {
    return this.id;
  }
}
