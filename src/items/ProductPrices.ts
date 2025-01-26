import { ProductPrice } from './ProductPrice';

export class ProductPrices {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  normal: ProductPrice | null = null;
  promotion: ProductPrice | null = null;

  fromData(data: { normal?: string; promotion?: string } = {}): ProductPrices {
    this.normal = new ProductPrice(this.stores).fromString(data.normal || '');
    this.promotion = new ProductPrice(this.stores).fromString(
      data.promotion || '',
    );
    return this;
  }
  toData(): { normal: string; promotion: string } {
    return {
      normal: this.normal?.toString() ?? '',
      promotion: this.promotion?.toString() ?? '',
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(item: ProductPrices): boolean {
    return this === item;
  }

  compare(item: ProductPrices): number {
    return 0;
  }
}
