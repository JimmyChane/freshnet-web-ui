const Text = require("./Text.js");

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
      this.method = Text.trim(data.method, "");
      this.path = Text.trim(data.path, "");
   }
}

module.exports = ProductImage;
