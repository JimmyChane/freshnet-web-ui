const Text = require("./Text.js");

class ServiceLabel {
   static Defaults = {
      Urgent: new ServiceLabel({ title: "Urgent", hexColor: "d93f35" }),
      Warranty: new ServiceLabel({ title: "Warranty", hexColor: "db950c" }),
   };

   constructor(data = null) {
      this.title = Text.trim(data.title, "");
      this.hexColor = Text.trim(data.hexColor, "").replace(" ", "");
   }
}

module.exports = ServiceLabel;
