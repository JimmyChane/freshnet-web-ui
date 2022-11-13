const Text = require("./Text.js");
const ServicePrice = require("./ServicePrice.js");

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
      this.username = Text.trim(data.username, "").replace(" ", "");
      this.nameOfUser = Text.trim(data.nameOfUser, "");
      this.description = Text.trim(data.description, "");

      this.method = Text.trim(data.method, "").replace(" ", "");
      // for method info
      this.status = Text.trim(data.status, "");
      // for method purchase
      this.price =
         typeof data.price === "object" ? ServicePrice.trim(data.price) : undefined;
   }
}

module.exports = ServiceEvent;
