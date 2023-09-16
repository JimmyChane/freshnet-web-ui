import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";

export default class Ps2Disc {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = "";
  code: string = "";
  title: string = "";

  fromData(data: any) {
    this.id = U.trimId(data._id);
    this.code = U.trimId(data.code);
    this.title = U.trimText(data.title);
    return this;
  }
  toData(): any {
    return {
      _id: U.trimId(this.id),
      code: U.trimId(this.code),
      title: U.trimText(this.title),
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
