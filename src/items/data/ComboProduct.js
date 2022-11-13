const Text = require("./Text.js");
const Image = require("./Image.js");
const ComboProductInclude = require("./ComboProductInclude.js");

class ComboProduct {
   static trim(data) {
      return new ComboProduct(data);
   }

   constructor(data = null) {
      this.images = (Array.isArray(data.images) ? data.images : []).map(
         (image) => Image.trim(image)
      );
      this.title = Text.trim(data.title, "");
      this.price = Text.trim(data.price, "");
      this.productIncludes = (
         Array.isArray(data.productIncludes) ? data.productIncludes : []
      ).map((productInclude) => ComboProductInclude.trim(productInclude));
   }
}

module.exports = ComboProduct;
