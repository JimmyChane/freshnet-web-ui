import PhoneNumber from "./PhoneNumber";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
import CustomerDevice from "./CustomerDevice";

const textContains = ItemSearcher.textContains;

interface CustomerData {
  _id: string;
  name: string;
  phoneNumber: string | undefined;
  description: string;
  deviceIds: string[];
}

export default class Customer {
  static Requirement = {
    name: { isRequired: true },
    phoneNumber: { isRequired: false },
    description: { isRequired: false },
    deviceIds: { isRequired: false },
  };

  stores: any = null;
  customerStore: any = null;

  constructor(stores: any) {
    this.stores = stores;
    this.customerStore = stores.customer;
  }

  id: string = "";
  name: string = "";
  phoneNumber: PhoneNumber | null = null;
  description: string = "";
  deviceIds: string[] = [];

  cachedServices: any[] = [];
  cachedOrders: any[] = [];

  get services(): any[] {
    return this.cachedServices;
  }

  get orders(): any[] {
    return this.cachedOrders;
  }

  fromData(data: CustomerData): this {
    this.id = U.trimId(data._id);
    this.name = U.trimText(data.name);
    const phoneNumber = U.trimText(data.phoneNumber);
    this.phoneNumber = phoneNumber
      ? new PhoneNumber(this.stores).fromData({ value: phoneNumber })
      : null;
    this.description = U.trimText(data.description);
    this.deviceIds = U.optArray(data.deviceIds)
      .map((deviceId) => U.trimId(deviceId))
      .filter((deviceId) => !!deviceId);
    return this;
  }

  toData(): CustomerData {
    return {
      _id: U.trimId(this.id),
      name: U.trimText(this.name),
      phoneNumber: this.phoneNumber?.toData().value ?? "",
      description: U.trimText(this.description),
      deviceIds: this.deviceIds.map((deviceId) => deviceId),
    };
  }

  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains("customer", str)) count++;
      if (textContains(this.name, str)) count++;
      if (textContains(this.phoneNumber?.toString() ?? "", str)) count++;
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

  async fetchDevices(): Promise<(CustomerDevice | undefined)[]> {
    if (!this.deviceIds.length) return [];
    const devices: CustomerDevice[] = await this.customerStore.dispatch(
      "getDevices",
    );
    return this.deviceIds.map((deviceId) => {
      return devices.find((device) => device.id === deviceId);
    });
  }

  async fetchDeviceGroups(property: string = ""): Promise<any[]> {
    const devices: (CustomerDevice | undefined)[] = await this.fetchDevices();

    const optGroup = (groups: Record<string, any>[], key: any) => {
      let group = groups.find((group) => group[property] === key);
      if (!group) {
        group = { devices: [] };
        group[property] = key;
        groups.push(group);
      }
      return group;
    };

    return devices.reduce((groups: any[], device: any) => {
      if (!device) return groups;

      const deviceValue = device[property];

      optGroup(groups, deviceValue).devices.push(device);
      return groups;
    }, []);
  }
}
