const { default: U } = require("@/U.js");
const ProductPrice = require("./ProductPrice.js");

class ProductStock {
   static trim(data) {
      return new ProductStock(data);
   }

   constructor(data = null) {
      this.isAvailable = U.optBoolean(data.isAvailable, true);
      this.isSecondHand = U.optBoolean(data.isSecondHand, false);

      // deprecated on 2022_04_09
      this.prices = U.optArray(data.prices)
         .map((price) => ProductPrice.trim(price))
         .filter((price) => price && Object.keys(price).length);
   }
}

module.exports = ProductStock;
