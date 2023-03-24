const { default: U } = require("@/U.js");

class ServicePrice {
   static trim(data) {
      return new ServicePrice(data);
   }

   constructor(data = null) {
      this.currency = U.trimId(data.currency);
      this.amount = U.trimId(data.amount);
   }
}

module.exports = ServicePrice;
