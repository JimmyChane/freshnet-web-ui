import U from "@/U";

export default class ServiceBelonging {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  title: string = "";
  time: number = 0;
  quantity: number = 1;
  description: string = "";

  fromData(data: any) {
    this.title = U.trimText(data.title);
    this.time = data.time;
    this.quantity = Math.max(U.optNumber(data.quantity), 1);
    this.description = U.trimText(data.description);
    return this;
  }
  toData(): any {
    return {
      title: U.trimText(this.title),
      time: this.time,
      quantity: Math.max(U.optNumber(this.quantity), 1),
      description: U.trimText(this.description),
    };
  }
}
