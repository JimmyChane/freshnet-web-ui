import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ProductSpecContent {
   stores = null;
   specificationStore = null;

   constructor(stores) {
      this.stores = stores;
      this.specificationStore = stores.specification;
   }

   content = "";
   type = "";
   typeKey = "";

   fromData(data) {
      this.type = U.trimId(data.key);
      this.typeKey = this.type;
      this.content = U.trimText(data.content);
      this.fetchType();

      return this;
   }
   toData() {
      return {
         key: this.type?.key ?? undefined,
         content: this.content,
      };
   }
   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains(this.content, str)) count++;
         return count;
      }, 0);
   }

   compare(item) {
      return 0;
   }

   async fetchType() {
      if (!U.isString(this.type)) return this.type;

      const specifications = await this.specificationStore.dispatch("getItems");
      const specification = specifications.find((spec) => {
         return spec.key == this.typeKey;
      });
      this.type = specification;
      return this.type;
   }
}

export default ProductSpecContent;
