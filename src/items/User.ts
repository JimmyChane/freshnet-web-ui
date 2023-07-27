import { Item } from "@/stores/tools/List";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";

interface UserData {
  username: string;
  name: string;
  userType: number;
}

export default class User implements Item {
  static Type = { None: -1, Admin: 0, Staff: 1, Customer: 2 };
  static ReservedUsername = { Admin: "admin", Staff: "staff" };

  stores: any | null;

  constructor(stores: any | null) {
    this.stores = stores;
  }

  username: string = "";
  name: string = "";
  userType: number = User.Type.None;

  fromData(data: UserData): this {
    this.username = U.trimId(data.username);
    this.name = U.trimText(data.name);
    this.userType = data.userType;
    return this;
  }

  toData(): UserData {
    return {
      username: U.trimId(this.username),
      name: U.trimText(this.name),
      userType: this.userType,
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (ItemSearcher.textContains(this.username, str)) count++;
      if (ItemSearcher.textContains(this.name, str)) count++;
      return count;
    }, 0);
  }

  toTextUserType(): string {
    if (this.isTypeAdmin()) return "Admin";
    if (this.isTypeStaff()) return "Staff";
    if (this.isTypeCustomer()) return "Customer";
    return "Other";
  }

  isTypeNone(): boolean {
    return (
      this.userType === User.Type.None ||
      (!this.isTypeAdmin() && !this.isTypeStaff() && !this.isTypeCustomer())
    );
  }

  isTypeAdmin(): boolean {
    return this.userType === User.Type.Admin;
  }

  isTypeStaff(): boolean {
    return this.userType === User.Type.Staff;
  }

  isTypeCustomer(): boolean {
    return this.userType === User.Type.Customer;
  }

  isDefault(): boolean {
    return (
      this.username === User.ReservedUsername.Admin ||
      this.username === User.ReservedUsername.Staff
    );
  }

  compare(item: User): number {
    return 0;
  }

  getUnique(): string {
    return this.username;
  }
}
