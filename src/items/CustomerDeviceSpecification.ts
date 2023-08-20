import U from "@/U";

export default class CustomerDeviceSpecification {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  typeKey: string = "";
  content: string = "";

  fromData(data: any): CustomerDeviceSpecification {
    this.typeKey = U.trimId(data.typeKey);
    this.content = U.trimText(data.content);

    return this;
  }
  toData(): any {
    return {
      typeKey: U.trimId(this.typeKey),
      content: U.trimText(this.content),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  compare(item: CustomerDeviceSpecification): number {
    return 0;
  }
}
