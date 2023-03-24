const { default: U } = require("@/U.js");

class ProductImage {
   static Method = {
      Local: "local",
      Link: "link",
      StorageImage: "storage-image",
   };
   static StorageType = {
      Gcloud: "gcloudstorage-type1",
      Gdrive: "gdrive-type2",
   };

   static trim(data) {
      return new ProductImage(data);
   }

   constructor(data = null) {
      this.method = U.trimId(data.method);
      this.path = U.trimId(data.path);
   }
}

module.exports = ProductImage;
