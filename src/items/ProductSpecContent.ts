import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
const textContains = ItemSearcher.textContains;
import ProductSpecType from "@/items/ProductSpecType";

export default class ProductSpecContent {
  stores: any;
  specificationStore: any;

  constructor(stores: any) {
    this.stores = stores;
    this.specificationStore = stores.specification;
  }

  content: string = "";
  type: ProductSpecType | string | null = "";
  typeKey: string | null = "";

  fromData(data: { key?: string; content?: string }): ProductSpecContent {
    this.type = U.trimId(data.key);
    this.typeKey = this.type;
    this.content = U.trimText(data.content);
    this.fetchType();

    return this;
  }
  toData(): { key: string | undefined; content: string } {
    return {
      key:
        this.type instanceof ProductSpecType
          ? this.type.key
          : typeof this.typeKey === "string"
          ? this.typeKey
          : undefined,
      content: this.content,
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.content, str)) count++;
      return count;
    }, 0);
  }

  compare(item: ProductSpecContent): number {
    return 0;
  }

  async fetchType(): Promise<any> {
    if (!U.isString(this.type)) return this.type;

    const specifications: ProductSpecType[] =
      await this.specificationStore.dispatch("getItems");
    const specification = specifications.find((spec: any) => {
      return spec.key == this.typeKey;
    });
    this.type = specification ?? null;
    return this.type;
  }
}
