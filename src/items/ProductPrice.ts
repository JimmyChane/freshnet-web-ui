import {
  DEFAULT_CURRENCY as PRICE_DEFAULT_CURRENCY,
  Price,
  parsePrice,
} from '@/objects/Price';

export const DEFAULT_CURRENCY = PRICE_DEFAULT_CURRENCY;

export class ProductPrice {
  stores: any;

  private price: Price | null = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  fromString(str: string): ProductPrice {
    const { currency, amount: value } = parsePrice(str);
    this.fromData({ currency, value });
    return this;
  }
  fromData(
    data: { currency: string; value: number } = { currency: '', value: 0 },
  ): ProductPrice {
    this.price = new Price(data.value, data.currency);
    return this;
  }
  toData(): { currency: string; value: number } {
    return {
      currency: this.price?.currency ?? '',
      value: this.price?.amount ?? 0,
    };
  }
  toCount(strs: string[]): number {
    return this.price?.toCount(strs) ?? 0;
  }
  toString(): string {
    return this.price?.toString() ?? '';
  }

  compare(item: ProductPrice): number {
    return this.price?.compare(item.price ?? new Price()) ?? 0;
  }

  plus(value: ProductPrice | number): ProductPrice {
    const price =
      value instanceof ProductPrice
        ? (this.price?.plus(value.price) ?? new Price(0, ''))
        : (this.price?.plus(value) ?? new Price(0, ''));
    const data = { value: price.amount, currency: price.currency };
    return new ProductPrice(this.stores).fromData(data);
  }
  minus(value: ProductPrice | number): ProductPrice {
    const price =
      value instanceof ProductPrice
        ? (this.price?.minus(value.price) ?? new Price(0, ''))
        : (this.price?.minus(value) ?? new Price(0, ''));
    const data = { value: price.amount, currency: price.currency };
    return new ProductPrice(this.stores).fromData(data);
  }

  get value(): number {
    return this.price?.amount ?? 0;
  }
  get currency(): string {
    return this.price?.currency ?? '';
  }
}
