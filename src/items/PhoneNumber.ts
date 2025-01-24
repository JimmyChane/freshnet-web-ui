import { optString } from '@/U';

import ItemSearcher from '../objects/ItemSearcher';

interface PhoneNumberData {
  value: string;
}

export default class PhoneNumber {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  value: string = '';

  fromData(data: PhoneNumberData): this {
    this.value = data.value;
    return this;
  }

  toData(): PhoneNumberData {
    return {
      value: this.value,
    };
  }

  toString(): string {
    let value = optString(this.value);

    const spliceString = (
      text: string,
      index: number,
      count: number = 1,
    ): string => {
      if (count <= 0) return text;
      if (index === 0) return text.slice(index + count, text.length);
      if (text.length <= index + count) return text.slice(0, index);
      return text.slice(0, index) + text.slice(index + count, text.length);
    };

    for (let i = 0; i < value.length; i++) {
      let char = value.charAt(i);
      let number = Number.parseInt(char);
      if (Number.isNaN(number)) {
        value = spliceString(value, i);
        i--;
      }
    }

    return value;
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (ItemSearcher.textContains(this.value, str)) count += 4;
      return count;
    }, 0);
  }

  isEqual(item: PhoneNumber): boolean {
    return item.value === this.value;
  }

  compare(item: PhoneNumber): number {
    return optString(this.value).localeCompare(optString(item.value));
  }
}
