import PhoneNumber from "./PhoneNumber.js";
import U from "@/U.js";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ServiceCustomer {
   stores = null;
   constructor(stores) {
      this.stores = stores;
   }

   name = "";
   phoneNumber = null;

   fromData(data) {
      this.name = U.optString(data.name);
      this.phoneNumber = data.phoneNumber
         ? new PhoneNumber(this.stores).fromData(data.phoneNumber)
         : null;
      return this;
   }
   toData() {
      return {
         name: this.name,
         phoneNumber: this.phoneNumber?.toData() ?? "",
      };
   }
   toCount(strs) {
      let count = strs.reduce((count, str) => {
         if (textContains("customer", str)) count++;
         if (textContains(this.name, str)) count++;
         return count;
      }, 0);
      if (this.phoneNumber) count += this.phoneNumber.toCount(strs);

      return count;
   }

   isEqual(item) {
      const eName = U.optString(item.name);
      const ePhoneNumber = item.phoneNumber;
      const ePhoneNumberValue = ePhoneNumber?.value ?? "";

      const name = U.optString(this.name);
      const phoneNumber = this.phoneNumber;
      const phoneNumberValue = phoneNumber?.value ?? "";

      return eName === name && ePhoneNumberValue === phoneNumberValue;
   }

   compare(item) {
      return this.compareName(item) + this.comparePhoneNumber(item);
   }
   compareName(item) {
      const name1 = U.optString(this.name);
      const name2 = U.optString(item.name);
      return name1.localeCompare(name2);
   }
   comparePhoneNumber(item) {
      if (!this.phoneNumber && !item.phoneNumber) return 0;
      if (this.phoneNumber && !item.phoneNumber) return 1;
      if (!this.phoneNumber && item.phoneNumber) return -1;
      return this.phoneNumber.compare(item.phoneNumber);
   }
}

export default ServiceCustomer;
