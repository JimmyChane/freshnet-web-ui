import Image from "./Image";
import SpecificationType from "./data/SpecificationType";
import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ProductSpecType {
   static Key = SpecificationType.Key;

   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   id = "";
   key = "";
   title = "";
   icon = null;
   color = "";

   fromData(data) {
      data = SpecificationType.trim(data);

      this.id = data._id;
      this.key = data.key;
      this.title = data.title;
      this.icon = U.isObjectOnly(data.icon)
         ? new Image().fromData(data.icon)
         : "";
      this.color = data.color;

      return this;
   }
   toData() {
      return {
         _id: this.id,
         key: this.key,
         title: this.title,
         icon: this.icon?.toData() ?? {},
         color: this.color,
      };
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains(this.key, str)) count++;
         if (textContains(this.title, str)) count++;
         return count;
      }, 0);
   }

   compare(item) {
      return 0;
   }
}

export default ProductSpecType;
