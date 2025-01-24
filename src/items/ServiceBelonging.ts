import { optNumber, trimText } from '@/U';

export default class ServiceBelonging {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  title: string = '';
  time: number = 0;
  quantity: number = 1;
  description: string = '';

  fromData(data: any) {
    this.title = trimText(data.title);
    this.time = data.time;
    this.quantity = Math.max(optNumber(data.quantity), 1);
    this.description = trimText(data.description);
    return this;
  }
  toData(): any {
    return {
      title: trimText(this.title),
      time: this.time,
      quantity: Math.max(optNumber(this.quantity), 1),
      description: trimText(this.description),
    };
  }
}
