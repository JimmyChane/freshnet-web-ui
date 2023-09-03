import U from "@/U";
import Vue from "vue";
import { Item } from "@/stores/tools/List";

export class SettingBuilder {
  key?: string = undefined;
  title?: string = undefined;
  type?: string = undefined;
  readonly: boolean = false;
  list?: SettingBuilder[] = undefined;

  setKey(key: string = "") {
    this.key = key;
    return this;
  }
  setTitle(title: string = "") {
    this.title = title;
    return this;
  }
  setType(type: string = "") {
    this.type = type;
    return this;
  }
  setList(...list: SettingBuilder[]) {
    this.list = list;
    return this;
  }
  setReadonly(readonly: boolean = false) {
    this.readonly = readonly;
    return this;
  }
  build(context: Vue): SettingContext {
    const setting = new SettingContext(context);
    setting.key = this.key;
    setting.title = this.title;
    setting.type = this.type;
    setting.readonly = this.readonly;

    if (Array.isArray(this.list)) {
      setting.list = this.list
        .filter((subSettingBuilder) => {
          return subSettingBuilder instanceof SettingBuilder;
        })
        .map((subSettingBuilder) => {
          const subSetting = subSettingBuilder.build(context);
          subSetting.parent = setting;
          return subSetting;
        });
    }

    return setting;
  }
}

export class SettingContext {
  context: Vue;

  key?: string = undefined;
  title?: string = undefined;
  type?: string = undefined;
  readonly: boolean = false;
  parent?: SettingContext = undefined;
  list?: SettingContext[] = undefined;

  constructor(context: Vue) {
    this.context = context;
  }

  getKey() {
    return U.optString(this.key);
  }
  getTitle() {
    return U.optString(this.title);
  }
  getParentTitle() {
    return this.parent?.getTitle() ?? "";
  }

  getType() {
    return U.optString(this.type);
  }
  getList() {
    return U.optArray(this.list);
  }
  isReadonly() {
    return this.readonly;
  }

  findValue() {
    return this.context.$store.state.stores.user.getters.items.find(
      (setting: Setting) => {
        return setting.key === this.key;
      },
    );
  }
  async updateValue(value: any) {
    if (!this.getKey().length) return;

    const data = { key: this.getKey(), value };
    await this.context.$store.state.stores.user.dispatch("updateItem", data);
  }
}

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

  getUnique(): string {
    return this.key;
  }
}
