import U from "@/U";

interface SettingData {
  key: string;
  visibility?: string;
  value: any;
}

export default class Setting {
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
    this.key = U.trimId(data.key);
    this.visibility = U.trimId(data.visibility);
    this.value = data.value;
    return this;
  }

  toData(): SettingData {
    return {
      key: U.trimId(this.key),
      visibility: U.trimId(this.visibility),
      value: this.value,
    };
  }
}
