import { isObject, isString, optArray, trimId, trimText } from '@/U';
import { textContains } from '@/objects/ItemSearcher';

import {
  INFO_SERVICE_EVENT_METHOD,
  PURCHASE_SERVICE_EVENT_METHOD,
  QUOTATION_SERVICE_EVENT_METHOD,
} from './ServiceEventMethod';
import ServiceImage from './ServiceImage';
import ServicePrice from './ServicePrice';
import ServiceTimestamp from './ServiceTimestamp';
import User from './User';

export default class ServiceEvent {
  stores: any;
  userStore: any;

  constructor(stores: any) {
    this.stores = stores;
    this.userStore = stores.user;
  }

  timestamp: ServiceTimestamp | null = null;
  username: string = '';
  name: string = '';
  method: string = '';
  description: string = '';
  status: string = '';
  price: ServicePrice | null = null;
  images: ServiceImage[] = [];

  fromData(data: any) {
    this.timestamp = new ServiceTimestamp(data.time);
    this.username = trimId(data.username);
    this.name = trimText(data.nameOfUser);
    this.method = trimId(data.method);
    this.description = trimText(data.description);
    this.status = trimId(data.status);
    this.price = isObject(data.price)
      ? new ServicePrice().fromData(data.price)
      : null;
    this.images = optArray(data.images).map((image: any) => {
      return new ServiceImage(this.stores).fromData(image);
    });
    return this;
  }

  toData() {
    return {
      time: this.timestamp?.time ?? null,
      username: trimId(this.username),
      nameOfUser: trimText(this.name),
      method: trimId(this.method),
      description: trimText(this.description),
      status: trimId(this.status),
      price: this.price?.toData() ?? null,
      images: this.images.map((image) => image.toData()),
    };
  }

  toCount(strs: string[]) {
    let count = strs.reduce((count, str) => {
      if (textContains('event', str)) count++;
      if (textContains(this.username, str)) count++;
      if (textContains(this.name, str)) count++;
      if (textContains(this.method, str)) count++;
      if (textContains(this.description, str)) count++;
      if (textContains(this.status, str)) count++;
      return count;
    }, 0);

    count += this.timestamp ? this.timestamp.toCount(strs) : 0;

    return count;
  }

  toResult() {
    if (this.isQuotation() || this.isPurchase()) return this.price;
    if (this.isInfo()) return this.status;
    return null;
  }

  isInfo() {
    return this.method === INFO_SERVICE_EVENT_METHOD.key;
  }

  isQuotation() {
    return this.method === QUOTATION_SERVICE_EVENT_METHOD.key;
  }

  isPurchase() {
    return this.method === PURCHASE_SERVICE_EVENT_METHOD.key;
  }

  compare(item: ServiceEvent) {
    return (item.timestamp?.time ?? 0) - (this.timestamp?.time ?? 0);
  }

  async fetchUser(): Promise<User | null> {
    if (!isString(this.username) || this.username.trim().length === 0)
      return null;
    return await this.userStore.dispatch('getUserByUsername', this.username);
  }

  async fetchName(): Promise<string> {
    const user = await this.fetchUser();
    const username = user ? user.username : '';

    if (username.length && this.name) return `${this.name}(${username})`;
    if (!username.length && this.name) return this.name;
    if (username.length && !this.name) return username;

    throw new Error('unknown');
  }
}
