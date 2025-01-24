import { optArray, optBoolean } from '@/U';

import ProductPrices from './ProductPrices';

export default class ProductStock {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  isAvailable: boolean = true;
  isSecondHand: boolean = false;
  prices: any[] = [];

  fromData(data: any) {
    this.isAvailable = optBoolean(data.isAvailable, true);
    this.isSecondHand = optBoolean(data.isSecondHand, false);

    // deprecated on 2022_04_09
    this.prices = optArray(data.prices)
      .map((price) => new ProductPrices(this.stores).fromData(price))
      .map((price) => price.toData())
      .filter((price) => price && Object.keys(price).length);

    return this;
  }
  toData(): any {
    return {
      isAvailable: optBoolean(this.isAvailable),
      isSecondHand: optBoolean(this.isSecondHand),
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
