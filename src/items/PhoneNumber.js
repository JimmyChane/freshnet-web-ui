import ModulePhoneNumber from "./data/PhoneNumber.js";
import ItemSearcher from "../objects/ItemSearcher.js";
import U from "@/U.js";
const textContains = ItemSearcher.textContains;

class PhoneNumber {
   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   value = "";

   fromData(data) {
      this.value = data;
      return this;
   }
   toData() {
      return this.value;
   }
   toString() {
      return ModulePhoneNumber.parseToString(this.value);
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains(this.value, str)) count += 4;
         return count;
      }, 0);
   }

   isEqual(item) {
      return item.value === this.value;
   }

   compare(item) {
      return U.optString(this.value).localeCompare(U.optString(item.value));
   }
}

export default PhoneNumber;
