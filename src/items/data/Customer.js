const { default: U } = require("@/U.js");

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
      this._id = U.trimId(data._id);
      this.name = U.trimText(data.name);
      this.phoneNumber = U.trimText(data.phoneNumber);
      this.description = U.trimText(data.description);
      this.deviceIds = U.optArray(data.deviceIds)
         .map((deviceId) => U.trimId(deviceId))
         .filter((deviceId) => deviceId);
   }
}

module.exports = Customer;
