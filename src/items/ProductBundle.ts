import { trimText } from '@/U';

export class ProductBundle {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  title: string = '';

  fromData(data: { title?: string }): ProductBundle {
    this.title = trimText(data.title || '');
    return this;
  }
  toData(): { title: string } {
    return { title: trimText(this.title) };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(item: ProductBundle): boolean {
    return this === item;
  }

  compare(item: ProductBundle): number {
    return 0;
  }
}
