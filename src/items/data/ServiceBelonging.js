const Text = require("./Text.js");

class ServiceBelonging {
   static trim(data) {
      return new ServiceBelonging(data);
   }

   constructor(data = null) {
      this.title = Text.trim(data.title, "");
      this.time = data.time;
      this.quantity =
         typeof data.quantity === "number" && data.quantity > 0
            ? data.quantity
            : 1;
   }
}

module.exports = ServiceBelonging;
