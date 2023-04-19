import Image from "./Image.js";
import ModuleBrand from "./data/ProductBrand.js";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class Brand {
   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   id = "";
   title = "";
   icon = null;

   fromData(data) {
      data = ModuleBrand.trim(data);
      this.id = data._id;
      this.title = data.title;
      this.icon = data.icon ? new Image().fromData(data.icon) : null;
      return this;
   }
   toData() {
      return {
         _id: this.id,
         title: this.title,
         icon: this.icon?.toData() ?? {},
      };
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains(this.title, str)) count++;
         if (textContains(this.title, str)) count++;
         return count;
      }, 0);
   }

   isEqual(obj) {
      return this.id == obj.id && this.title == obj.title;
   }

   compare(item) {
      return this.title.localeCompare(item.title);
   }
}

export default Brand;
