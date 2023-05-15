const { default: U } = require("@/U.js");

class Setting {
   static Visibility = { Protected: "protected", Private: "private" };
   static Key = {
      PublicShowPrice: "public-showPrice",
      Location: "store-location",
      LocationLink: "store-location-link",
      Contacts: "store-contacts",
      CompanyName: "store-name",
      CompanyCategory: "store-category",
      CompanyWorkingHours: "store-working-hours",
   };

   stores = null;

   key = "";
   visibility = "";
   value = undefined;

   constructor(stores) {
      this.stores = stores;
   }

   fromData(data = null) {
      this.key = U.trimId(data.key);
      this.visibility = U.trimId(data.visibility);
      this.value = data.value;
      return this;
   }
   toData() {
      return {
         key: U.trimId(this.key),
         visibility: U.trimId(this.visibility),
         value: this.value,
      };
   }
}

module.exports = Setting;
