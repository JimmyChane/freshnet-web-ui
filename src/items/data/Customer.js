const Text = require("./Text.js");

class Customer {
   static Requirement = {
      name: { isRequired: true },
      phoneNumber: { isRequired: false },
      description: { isRequired: false },
      deviceIds: { isRequired: false },
   };

   static trim(data) {
      return new Customer(data);
   }

   constructor(data = null) {
      this._id = Text.trim(data._id, "");
      this.name = Text.trim(data.name, "");
      this.phoneNumber = Text.trim(data.phoneNumber, "");
      this.description = Text.trim(data.description, "");
      this.deviceIds = (Array.isArray(data.deviceIds) ? data.deviceIds : [])
         .map((deviceId) => Text.trim(deviceId))
         .filter((deviceId) => deviceId);
   }
}

module.exports = Customer;
