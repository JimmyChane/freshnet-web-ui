import PhoneNumber from "./PhoneNumber";
import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
const textContains = ItemSearcher.textContains;

export default class ServiceCustomer {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  name: string = "";
  phoneNumber: PhoneNumber | null = null;

  fromData(data: any): ServiceCustomer {
    this.name = U.trimText(data.name);

    const phoneNumber = U.trimStringAll(data.phoneNumber, undefined);
    this.phoneNumber = phoneNumber
      ? new PhoneNumber(this.stores).fromData({ value: phoneNumber })
      : null;
    return this;
  }
  toData(): any {
    return {
      name: U.trimText(this.name),
      phoneNumber: this.phoneNumber?.toData().value ?? "",
    };
  }
  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains("customer", str)) count++;
      if (textContains(this.name, str)) count += 4;
      return count;
    }, 0);
    if (this.phoneNumber) count += this.phoneNumber.toCount(strs);

    return count;
  }

  isEqual(item: ServiceCustomer): boolean {
    const eName = U.optString(item.name);
    const ePhoneNumber = item.phoneNumber;
    const ePhoneNumberValue = ePhoneNumber?.value ?? "";

    const name = U.optString(this.name);
    const phoneNumber = this.phoneNumber;
    const phoneNumberValue = phoneNumber?.value ?? "";

    return eName === name && ePhoneNumberValue === phoneNumberValue;
  }

  compare(item: ServiceCustomer): number {
    return this.compareName(item) + this.comparePhoneNumber(item);
  }
  compareName(item: ServiceCustomer): number {
    const name1 = U.optString(this.name);
    const name2 = U.optString(item.name);
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
