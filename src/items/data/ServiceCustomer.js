const Text = require("./Text.js");

class ServiceCustomer {
   static trim(data) {
      return new ServiceCustomer(data);
   }

   constructor(data = null) {
      this.name = Text.trim(data.name, "");
      this.phoneNumber = Text.trim(data.phoneNumber, undefined);
   }
}

module.exports = ServiceCustomer;
