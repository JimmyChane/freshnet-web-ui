const Text = require("./Text.js");

class ProductBundle {
   static trim(data) {
      return new ProductBundle(data);
   }

   constructor(data = null) {
      this.title = Text.trim(data.title, "");
   }
}

module.exports = ProductBundle;
