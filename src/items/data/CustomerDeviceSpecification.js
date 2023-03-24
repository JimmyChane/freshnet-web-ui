const { default: U } = require("@/U.js");

class CustomerDeviceSpecification {
   static trim(data) {
      return new CustomerDeviceSpecification(data);
   }

   constructor(data = null) {
      this.typeKey = U.trimId(data.typeKey);
      this.content = U.trimText(data.content);
   }
}

module.exports = CustomerDeviceSpecification;
