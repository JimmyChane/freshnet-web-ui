import { trimId } from "@/U";
import { Item } from "@/stores/tools/List";

interface SettingData {
  key: string;
  visibility?: string;
  value: any;
}

export default class Setting implements Item {
  static Visibility = { Protected: "protected", Private: "private" };
  static Key = {
    PublicShowPrice: "public-showPrice",
    Location: "store-location",
    LocationLink: "store-location-link",
    Contacts: "store-contacts",
    CompanyName: "store-name",
    CompanyCategory: "store-category",
    CompanyWorkingHours: "store-working-hours",
  };

  stores: any | null;

  key: string = "";
  visibility: string = "";
  value: any;

  constructor(stores: any | null) {
    this.stores = stores;
  }

  fromData(data: SettingData): this {
    this.key = trimId(data.key);
    this.visibility = trimId(data.visibility);
    this.value = data.value;
    return this;
  }

  toData(): SettingData {
    return {
      key: trimId(this.key),
      visibility: trimId(this.visibility),
      value: this.value,
    };
  }

  getUnique(): string {
    return this.key;
  }
}
