const Text = require("./Text.js");

class ComboProductInclude {
   static trim(data) {
      return new ComboProductInclude(data);
   }

   constructor(data = null) {
      this.productId = Text.trim(data.productId, "").replace(" ", "");
   }
}

module.exports = ComboProductInclude;
