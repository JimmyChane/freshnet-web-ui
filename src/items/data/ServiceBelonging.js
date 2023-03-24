const { default: U } = require("@/U.js");

class ServiceBelonging {
   static trim(data) {
      return new ServiceBelonging(data);
   }

   constructor(data = null) {
      this.title = U.trimText(data.title);
      this.time = data.time;
      this.quantity = Math.max(U.optNumber(data.quantity), 1);
   }
}

module.exports = ServiceBelonging;
