const CustomerDeviceSpecification = require("./CustomerDeviceSpecification.js");
const { default: U } = require("@/U.js");

class CustomerDevice {
   static trim(data) {
      return new CustomerDevice(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.ownerCustomerId = U.trimId(data.ownerCustomerId);
      this.description = U.trimText(data.description, "");
      this.categoryKey = U.trimId(data.categoryKey);
      this.specifications = U.optArray(data.specifications)
         .map((specification) => {
            return CustomerDeviceSpecification.trim(specification);
         })
         .filter((specification) => {
            return specification.typeKey && specification.content;
         });
   }
}

module.exports = CustomerDevice;
