const Text = require("./Text.js");

class CustomerDeviceSpecification {
   static trim(data) {
      return new CustomerDeviceSpecification(data);
   }

   constructor(data = null) {
      this.typeKey = Text.trim(data.typeKey, "").replace(" ", "");
      this.content = Text.trim(data.content, "");
   }
}

module.exports = CustomerDeviceSpecification;
