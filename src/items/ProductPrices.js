import U from "@/U.js";
import ProductPrice from "./ProductPrice";

class ProductPrices {
   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   normal = null;
   promotion = null;

   fromData(data = {}) {
      this.normal = ProductPrice.parseString(
         U.optString(U.trimText(data.normal)),
      );
      this.promotion = ProductPrice.parseString(
         U.optString(U.trimText(data.promotion)),
      );
      return this;
   }
   toData() {
      return {
         normal: this.normal.toData(),
         promotion: this.promotion.toData(),
      };
   }
   toCount(strs) {
      return 0;
   }

   isEqual(item) {
      return this === item;
   }

   compare(item) {
      return 0;
   }
}

export default ProductPrices;
