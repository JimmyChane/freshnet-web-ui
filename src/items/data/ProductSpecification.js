const { default: U } = require("@/U.js");

class ProductSpecification {
   static trim(data) {
      return new ProductSpecification(data);
   }

   constructor(data = null) {
      this.type = U.trimId(data.type);
      this.content = U.trimText(data.content);
   }
}

module.exports = ProductSpecification;
