const Text = require("./Text.js");

class Setting {
   static Key = {
      PublicShowPrice: "public-showPrice",
      Location: "store-location",
      LocationLink: "store-location-link",
      Contacts: "store-contacts",
   };
   static Visibility = { Protected: "protected", Private: "private" };

   static trim(data) {
      return new Setting(data);
   }

   constructor(data = null) {
      this.key = Text.trim(data.key, "").replace(" ", "");
      this.visibility = Text.trim(data.visibility, "");
      this.value = data.value;
   }
}

module.exports = Setting;
