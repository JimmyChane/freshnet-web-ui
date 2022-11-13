const Text = require("./Text.js");
const CustomerDeviceSpecification = require("./CustomerDeviceSpecification.js");

class CustomerDevice {
   static trim(data) {
      return new CustomerDevice(data);
   }

   constructor(data = null) {
      this._id = Text.trim(data._id, data._id);
      this.ownerCustomerId = Text.trim(data.ownerCustomerId, "").replace(
         " ",
         ""
      );
      this.description = Text.trim(data.description, "");
      this.categoryKey = Text.trim(data.categoryKey, "").replace(" ", "");
      this.specifications = (
         Array.isArray(data.specifications) ? data.specifications : []
      )
         .map((specification) =>
            CustomerDeviceSpecification.trim(specification)
         )
         .filter(
            (specification) => specification.typeKey && specification.content
         );
   }
}

module.exports = CustomerDevice;
