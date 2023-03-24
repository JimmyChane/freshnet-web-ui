const { default: U } = require("@/U.js");

class ServiceLabel {
   static Defaults = {
      Urgent: new ServiceLabel({ title: "Urgent", hexColor: "d93f35" }),
      Warranty: new ServiceLabel({ title: "Warranty", hexColor: "db950c" }),
   };

   constructor(data = null) {
      this.title = U.trimText(data.title);
      this.hexColor = U.trimId(data.hexColor);
   }
}

module.exports = ServiceLabel;
