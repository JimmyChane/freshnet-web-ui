import { trimId, trimText } from '@/U';
import { textContains } from '@/objects/ItemSearcher';
import { Item } from '@/stores/tools/List';

export interface UserData {
  username: string;
  name: string;
  userType: number;
}

export enum UserType {
  None = -1,
  Admin = 0,
  Staff = 1,
  Customer = 2,
}
export enum UserReservedUsername {
  Admin = 'admin',
  Staff = 'staff',
}

export default class User implements Item {
  stores: any | null;

  constructor(stores: any | null) {
    this.stores = stores;
  }

  username: string = '';
  name: string = '';
  userType: number = UserType.None;

  fromData(data: UserData): this {
    this.username = trimId(data.username);
    this.name = trimText(data.name);
    this.userType = data.userType;
    return this;
  }

  toData(): UserData {
    return {
      username: trimId(this.username),
      name: trimText(this.name),
      userType: this.userType,
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.username, str)) count++;
      if (textContains(this.name, str)) count++;
      return count;
    }, 0);
  }

  toTextUserType(): string {
    if (this.isTypeAdmin()) return 'Admin';
    if (this.isTypeStaff()) return 'Staff';
    if (this.isTypeCustomer()) return 'Customer';
    return 'Other';
  }

  isTypeNone(): boolean {
    return (
      this.userType === UserType.None ||
      (!this.isTypeAdmin() && !this.isTypeStaff() && !this.isTypeCustomer())
    );
  }

  isTypeAdmin(): boolean {
    return this.userType === UserType.Admin;
  }

  isTypeStaff(): boolean {
    return this.userType === UserType.Staff;
  }

  isTypeCustomer(): boolean {
    return this.userType === UserType.Customer;
  }

  isDefault(): boolean {
    return (
      this.username === UserReservedUsername.Admin ||
      this.username === UserReservedUsername.Staff
    );
  }

  compare(item: User): number {
    return 0;
  }

  getUnique(): string {
    return this.username;
  }
}
