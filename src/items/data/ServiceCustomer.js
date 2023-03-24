const { default: U } = require("@/U.js");

class ServiceCustomer {
   static trim(data) {
      return new ServiceCustomer(data);
   }

   constructor(data = null) {
      this.name = U.trimText(data.name);
      this.phoneNumber = U.trimStringAll(data.phoneNumber, undefined);
   }
}

module.exports = ServiceCustomer;
