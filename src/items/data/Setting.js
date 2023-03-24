const { default: U } = require("@/U.js");

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
      this.key = U.trimId(data.key);
      this.visibility = U.trimId(data.visibility);
      this.value = data.value;
   }
}

module.exports = Setting;
