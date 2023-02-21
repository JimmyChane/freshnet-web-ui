import ModulePhoneNumber from "./data/PhoneNumber.js";
import ItemSearcher from "./tools/ItemSearcher.js";
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
         count += textContains(this.value, str) ? 1 : 0;
         return count;
      }, 0);
   }

   compare(item) {
      return U.optString(this.value).localeCompare(U.optString(item.value));
   }

   isEqual(item) {
      return item.value === this.value;
   }
}

export default PhoneNumber;
