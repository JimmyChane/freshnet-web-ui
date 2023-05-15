import U from "@/U.js";
import ProductPrices from "./ProductPrices";

class ProductStock {
   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   isAvailable = true;
   isSecondHand = false;
   prices = [];

   fromData(data) {
      this.isAvailable = U.optBoolean(data.isAvailable, true);
      this.isSecondHand = U.optBoolean(data.isSecondHand, false);

      // deprecated on 2022_04_09
      this.prices = U.optArray(data.prices)
         .map((price) => new ProductPrices(this.stores).fromData(price))
         .map((price) => price.toData())
         .filter((price) => price && Object.keys(price).length);

      return this;
   }
   toData() {
      return {
         isAvailable: U.optBoolean(this.isAvailable),
         isSecondHand: U.optBoolean(this.isSecondHand),
         prices: this.prices
            .map((price) => new ProductPrices(this.stores).fromData(price))
            .map((price) => price.toData()),
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

export default ProductStock;
