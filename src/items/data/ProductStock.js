const ProductPrice = require("./ProductPrice.js");

class ProductStock {
   static trim(data) {
      return new ProductStock(data);
   }

   constructor(data = null) {
      this.isAvailable =
         typeof data.isAvailable === "boolean" ? data.isAvailable : true;
      this.isSecondHand =
         typeof data.isSecondHand === "boolean" ? data.isSecondHand : false;

      // deprecated on 2022_04_09
      this.prices = (Array.isArray(data.prices) ? data.prices : [])
         .map((price) => ProductPrice.trim(price))
         .filter((price) => price && Object.keys(price).length);
   }
}

module.exports = ProductStock;
