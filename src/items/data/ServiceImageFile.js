const Image = require("./Image.js");
const { default: U } = require("@/U.js");

class ServiceImageFile {
   static Method = Image.Method;
   static StorageType = Image.StorageType;

   static trim(data) {
      return new ServiceImageFile(data);
   }

   constructor(data = null) {
      const image = Image.trim(data);

      this.name = U.trimId(data.name);
      this.path = image.path;
      this.method = image.method;
      this.storageType = U.trimId(data.storageType);
   }
}

module.exports = ServiceImageFile;
