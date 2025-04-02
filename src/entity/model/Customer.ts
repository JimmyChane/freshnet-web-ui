import { optArray } from '@chanzor/utils';

import { trimId, trimText } from '@/U';
import { textContains } from '@/entity/ItemSearcher';
import type { Item } from '@/stores/tools/List';

import { PhoneNumber } from './PhoneNumber';

export interface CustomerData {
  _id: string;
  name: string;
  phoneNumber: string | undefined;
  description: string;
  deviceIds: string[];
}

export const RequirementCustomer = {
  name: { isRequired: true },
  phoneNumber: { isRequired: false },
  description: { isRequired: false },
  deviceIds: { isRequired: false },
};

export class Customer implements Item {
  id: string = '';
  name: string = '';
  phoneNumber: PhoneNumber | null = null;
  description: string = '';
  deviceIds: string[] = [];

  cachedServices: any[] = [];
  cachedOrders: any[] = [];

  get services(): any[] {
    return this.cachedServices;
  }

  get orders(): any[] {
    return this.cachedOrders;
  }

  getUnique(): string {
    return this.id;
  }

  fromData(data: CustomerData): this {
    this.id = trimId(data._id);
    this.name = trimText(data.name);
    const phoneNumber = trimText(data.phoneNumber);
    this.phoneNumber = phoneNumber
      ? new PhoneNumber().fromData({ value: phoneNumber })
      : null;
    this.description = trimText(data.description);
    this.deviceIds = optArray(data.deviceIds)
      .map((deviceId) => trimId(deviceId))
      .filter((deviceId) => !!deviceId);
    return this;
  }

  toData(): CustomerData {
    return {
      _id: trimId(this.id),
      name: trimText(this.name),
      phoneNumber: this.phoneNumber?.toData().value ?? '',
      description: trimText(this.description),
      deviceIds: this.deviceIds.map((deviceId) => deviceId),
    };
  }

  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains('customer', str)) count++;
      if (textContains(this.name, str)) count++;
      if (textContains(this.phoneNumber?.toString() ?? '', str)) count++;
      if (textContains(this.description, str)) count++;
      return count;
    }, 0);

    return count;
  }

  isFromStoreCustomer(): boolean {
    return !!this.id;
  }

  isModifiable(): boolean {
    return this.isFromStoreCustomer();
  }

  compare(item: Customer): number {
    return 0;
  }
}
