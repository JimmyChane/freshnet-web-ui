import { trimId, trimText } from "@/U";
import ItemSearcher from "../objects/ItemSearcher";

export default class Ps2Disc {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = "";
  code: string = "";
  title: string = "";

  fromData(data: any) {
    this.id = trimId(data._id);
    this.code = trimId(data.code);
    this.title = trimText(data.title);
    return this;
  }
  toData(): any {
    return {
      _id: trimId(this.id),
      code: trimId(this.code),
      title: trimText(this.title),
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (ItemSearcher.textContains("ps2", str)) count++;
      if (ItemSearcher.textContains("disc", str)) count++;
      if (ItemSearcher.textContains(this.code, str)) count++;
      if (ItemSearcher.textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Ps2Disc): number {
    return this.title.localeCompare(item.title);
  }
}
