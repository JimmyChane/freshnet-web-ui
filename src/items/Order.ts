import { trimId, trimText } from '@/U';
import { textContains } from '@/objects/ItemSearcher';
import { Item } from '@/stores/tools/List';

import OrderCustomer from './OrderCustomer';

export enum OrderStatus {
  Pending = 0,
  Completed = 1,
}

export default class Order implements Item {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = '';
  customer: OrderCustomer | null = null;
  content: string = '';
  createdAt: string = '';
  status: number = OrderStatus.Pending;

  fromData(data: any): Order {
    this.id = trimId(data._id);
    this.customer = new OrderCustomer(this.stores).fromData({
      name: trimText(data.customer_name),
      phoneNumber: trimText(data.phone_number),
    });
    this.content = trimText(data.content);
    this.createdAt = data.createdAt;
    this.status =
      data.status !== OrderStatus.Completed
        ? OrderStatus.Pending
        : OrderStatus.Completed;

    return this;
  }
  toData(): any {
    const customer = this.customer?.toData();
    return {
      _id: this.id,
      content: this.content,
      customer_name: customer?.name,
      phone_number: customer?.phoneNumber,
      createdAt: this.createdAt,
      status: this.status,
    };
  }
  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains('order', str)) count++;
      if (textContains(this.content, str)) count++;
      if (textContains(String(this.status), str)) count++;
      return count;
    }, 0);
    if (this.customer) count += this.customer.toCount(strs);

    return count;
  }

  compare(item: Order): number {
    return 0;
  }

  getUnique(): string {
    return this.id;
  }
}
