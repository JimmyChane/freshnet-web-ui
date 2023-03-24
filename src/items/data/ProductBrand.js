const Image = require("./Image.js");
const { default: U } = require("@/U.js");

class ProductBrand {
   static trim(data) {
      return new ProductBrand(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.title = U.trimText(data.title);
      this.icon = U.isObject(data.icon) ? Image.trim(data.icon) : undefined;
   }
}

module.exports = ProductBrand;
