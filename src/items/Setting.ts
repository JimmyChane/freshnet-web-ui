import { trimId } from '@/U';
import { Item } from '@/stores/tools/List';

interface SettingData {
  key: string;
  visibility?: string;
  value: any;
}

export enum SettingVisibility {
  Protected = 'protected',
  Private = 'private',
}
export enum SettingKey {
  PublicShowPrice = 'public-showPrice',
  Location = 'store-location',
  LocationLink = 'store-location-link',
  Contacts = 'store-contacts',
  CompanyName = 'store-name',
  CompanyCategory = 'store-category',
  CompanyWorkingHours = 'store-working-hours',
}

export class Setting implements Item {
  key: string = '';
  visibility: string = '';
  value: any;

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
