import ModuleUser, { Type } from "./data/User.js";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

export default class User {
   static Type = ModuleUser.Type;
   static ReservedUsername = ModuleUser.ReservedUsername;

   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   username = "";
   name = "";
   userType = Type.None;

   fromData(data) {
      data = new ModuleUser(data);
      this.username = data.username;
      this.name = data.name;
      this.userType = data.userType;
      return this;
   }
   toData() {
      return new ModuleUser({
         username: this.username,
         name: this.name,
         userType: this.userType,
      });
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains(this.username, str)) count++;
         if (textContains(this.name, str)) count++;
         return count;
      }, 0);
   }
   toTextUserType() {
      if (this.isTypeAdmin()) return "Admin";
      if (this.isTypeStaff()) return "Staff";
      if (this.isTypeCustomer()) return "Customer";
      return "Other";
   }

   isTypeNone() {
      return (
         this.userType === User.Type.None ||
         (!this.isTypeAdmin() && !this.isTypeStaff() && !this.isTypeCustomer())
      );
   }
   isTypeAdmin() {
      return this.userType === User.Type.Admin;
   }
   isTypeStaff() {
      return this.userType === User.Type.Staff;
   }
   isTypeCustomer() {
      return this.userType === User.Type.Customer;
   }
   isDefault() {
      return (
         this.username === User.ReservedUsername.Admin ||
         this.username === User.ReservedUsername.Staff
      );
   }

   compare(item) {
      return 0;
   }
}
