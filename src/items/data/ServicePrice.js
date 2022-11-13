const Text = require("./Text.js");

class ServicePrice {
   static trim(data) {
      return new ServicePrice(data);
   }

   constructor(data = null) {
      this.currency = Text.trim(data.currency, "").replace(" ", "");
      this.amount = Text.trim(data.amount, "").replace(" ", "");
   }
}

module.exports = ServicePrice;
