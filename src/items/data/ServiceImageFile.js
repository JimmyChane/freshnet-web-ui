const Text = require("./Text.js");
const Image = require("./Image.js");

class ServiceImageFile {
   static Method = Image.Method;
   static StorageType = Image.StorageType;

   static trim(data) {
      return new ServiceImageFile(data);
   }

   constructor(data = null) {
      const image = Image.trim(data);

      this.name = Text.trim(data.name, "");
      this.path = image.path;
      this.method = image.method;
      this.storageType = Text.trim(data.storageType, "").replace(" ", "");
   }
}

module.exports = ServiceImageFile;
