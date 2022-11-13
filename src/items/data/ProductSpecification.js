const Text = require("./Text.js");

class ProductSpecification {
   static trim(data) {
      return new ProductSpecification(data);
   }

   constructor(data = null) {
      this.type = Text.trim(data.type, "").replace(" ", "");
      this.content = Text.trim(data.content, "");
   }
}

module.exports = ProductSpecification;
