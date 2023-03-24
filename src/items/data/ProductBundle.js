const { default: U } = require("@/U.js");

class ProductBundle {
   static trim(data) {
      return new ProductBundle(data);
   }

   constructor(data = null) {
      this.title = U.trimText(data.title);
   }
}

module.exports = ProductBundle;
