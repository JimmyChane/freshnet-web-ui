const Text = require("./Text.js");
const Image = require("./Image.js");

class ProductBrand {
   static trim(data) {
      return new ProductBrand(data);
   }

   constructor(data = null) {
      this._id = Text.trim(data._id, data._id);
      this.title = Text.trim(data.title, "");
      this.icon =
         typeof data.icon === "object" ? Image.trim(data.icon) : undefined;
   }
}

module.exports = ProductBrand;
