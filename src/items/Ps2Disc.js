import ItemSearcher from "../objects/ItemSearcher.js";
import U from "@/U.js";
const textContains = ItemSearcher.textContains;

class Ps2Disc {
   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   id = "";
   code = "";
   title = "";

   fromData(data) {
      this.id = U.trimId(data._id);
      this.code = U.trimId(data.code);
      this.title = U.trimText(data.title);
      return this;
   }
   toData() {
      return {
         _id: U.trimId(this.id),
         code: U.trimId(this.code),
         title: U.trimText(this.title),
      };
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains("ps2", str)) count++;
         if (textContains("disc", str)) count++;
         if (textContains(this.code, str)) count++;
         if (textContains(this.title, str)) count++;
         return count;
      }, 0);
   }

   compare(item) {
      return this.title.localeCompare(item.title);
   }
}

export default Ps2Disc;
