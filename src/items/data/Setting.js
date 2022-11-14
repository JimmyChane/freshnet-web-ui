const Text = require("./Text.js");

class Setting {
   static Key = {
      PublicShowPrice: "public-showPrice",

      // Location: "store-location",
      // Contacts: "store-contacts",
   };
   static Visibility = { Protected: "protected", Private: "private" };

   static trim(data) {
      return new Setting(data);
   }

   constructor(data = null) {
      this.key = Text.trim(data.key, "").replace(" ", "");
      this.visibility = Text.trim(data.visibility, "");
      this.value = data.value;

      this.title = Text.trim(data.title, ""); // planned to remove
   }
}

module.exports = Setting;