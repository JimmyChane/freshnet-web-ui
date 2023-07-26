import U from "@/U";
import ProductPrices from "./ProductPrices";

export default class ProductStock {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  isAvailable: boolean = true;
  isSecondHand: boolean = false;
  prices: any[] = [];

  fromData(data: any) {
    this.isAvailable = U.optBoolean(data.isAvailable, true);
    this.isSecondHand = U.optBoolean(data.isSecondHand, false);

    // deprecated on 2022_04_09
    this.prices = U.optArray(data.prices)
      .map((price) => new ProductPrices(this.stores).fromData(price))
      .map((price) => price.toData())
      .filter((price) => price && Object.keys(price).length);

    return this;
  }
  toData(): any {
    return {
      isAvailable: U.optBoolean(this.isAvailable),
      isSecondHand: U.optBoolean(this.isSecondHand),
      prices: this.prices
        .map((price) => new ProductPrices(this.stores).fromData(price))
        .map((price) => price.toData()),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(item: ProductStock): boolean {
    return this === item;
  }

  compare(item: ProductStock): number {
    return 0;
  }
}
