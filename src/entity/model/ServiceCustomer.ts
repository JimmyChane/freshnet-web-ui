import { optString, trimStringAll, trimText } from '@/U';
import { textContains } from '@/entity/ItemSearcher';

import { PhoneNumber } from './PhoneNumber';

// todo: copied
export interface ServiceCustomerData {
  name?: string;
  phoneNumber?: string;
}

export class ServiceCustomer {
  constructor() {}

  name: string = '';
  phoneNumber: PhoneNumber | null = null;

  fromData(data: any): ServiceCustomer {
    this.name = trimText(data.name);

    const phoneNumber = trimStringAll(data.phoneNumber, undefined);
    this.phoneNumber = phoneNumber
      ? new PhoneNumber().fromData({ value: phoneNumber })
      : null;
    return this;
  }
  toData(): any {
    return {
      name: trimText(this.name),
      phoneNumber: this.phoneNumber?.toData().value ?? '',
    };
  }
  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains('customer', str)) count++;
      if (textContains(this.name, str)) count += 4;
      return count;
    }, 0);
    if (this.phoneNumber) count += this.phoneNumber.toCount(strs);

    return count;
  }

  isEqual(item: ServiceCustomer): boolean {
    const eName = optString(item.name);
    const ePhoneNumber = item.phoneNumber;
    const ePhoneNumberValue = ePhoneNumber?.value ?? '';

    const name = optString(this.name);
    const phoneNumber = this.phoneNumber;
    const phoneNumberValue = phoneNumber?.value ?? '';

    return eName === name && ePhoneNumberValue === phoneNumberValue;
  }

  compare(item: ServiceCustomer): number {
    return this.compareName(item) + this.comparePhoneNumber(item);
  }
  compareName(item: ServiceCustomer): number {
    const name1 = optString(this.name);
    const name2 = optString(item.name);
    return name1.localeCompare(name2);
  }
  comparePhoneNumber(item: ServiceCustomer): number {
    if (this.phoneNumber && item.phoneNumber)
      return this.phoneNumber.compare(item.phoneNumber);
    if (this.phoneNumber && !item.phoneNumber) return 1;
    if (!this.phoneNumber && item.phoneNumber) return -1;
    return 0;
  }
}
