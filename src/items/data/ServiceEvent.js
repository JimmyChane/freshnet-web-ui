const ServicePrice = require("./ServicePrice.js");
const { default: U } = require("@/U.js");

class ServiceEvent {
   static Method = {
      Info: "info",
      Quotation: "quotation",
      Purchase: "purchase",
   };

   static trim(data) {
      return new ServiceEvent(data);
   }

   constructor(data = null) {
      this.time = data.time;
      this.username = U.trimId(data.username);
      this.nameOfUser = U.trimText(data.nameOfUser);
      this.description = U.trimText(data.description);

      this.method = U.trimId(data.method);
      // for method info
      this.status = U.trimId(data.status);
      // for method purchase
      this.price = U.isObject(data.price)
         ? ServicePrice.trim(data.price)
         : undefined;
   }
}

module.exports = ServiceEvent;
