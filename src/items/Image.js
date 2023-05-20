import HostApi from "@/host/HostApi.js";
import U from "@/U.js";
import Filename from "../objects/Filename";

const getColors = require("get-image-colors"); // https://www.npmjs.com/package/get-image-colors

class Image {
   static dimensionToQuery(width = 0, height = 0) {
      width = width > 0 ? width : 0;
      height = height > 0 ? height : 0;

      if (width != 0 && height == 0) return `width=${width}`;
      if (width == 0 && height != 0) return `height=${height}`;
      if (width > 0 && height > 0) return `width=${width}&height=${height}`;
      return "";
   }

   static Method = {
      Local: "local",
      Link: "link",
      StorageImage: "storage-image",
   };
   static StorageType = {
      Gcloud: "gcloudstorage-type1",
      Gdrive: "gdrive-type2",
   };

   method;
   path;

   fromData(data) {
      this.method = U.trimId(data.method);
      this.path = U.trimId(data.path);
      return this;
   }
   toData() {
      return { method: U.trimId(this.method), path: U.trimId(this.path) };
   }
   toCount(strs) {
      return 0;
   }
   toUrl(option = { width: 0, height: 0 }) {
      let { width = 0, height = 0 } =
         U.isObject(option) && option !== null ? option : {};

      const method = this.method;
      const path = this.path;

      if (!method || !path) return "";
      if (method === Image.Method.Local) {
         let resPath = path;
         if (resPath.startsWith("."))
            resPath = resPath.substring(1, resPath.length);
         if (resPath.startsWith("/"))
            resPath = resPath.substring(1, resPath.length);
         if (resPath.startsWith("resource/")) {
            resPath = resPath.substring("resource/".length, resPath.length);
            return HostApi.res(resPath);
         }

         return `${HostApi.originApi}/${path}`;
      }
      if (method === Image.Method.Link) return path;
      if (method === Image.Method.StorageImage) {
         const prefix = "/api/image/name/";
         const name = path.substring(prefix.length, path.length);
         const filename = new Filename(name);
         const dimensionQuery = Image.dimensionToQuery(width, height);
         const query = dimensionQuery.length ? `?${dimensionQuery}` : "";
         return `${
            HostApi.originApi
         }/image/name/${filename.toString()}${query}`;
      }

      return "";
   }

   async fetchColor() {
      const palettes = await getColors(this.toUrl({ width: 20 }), { count: 1 });
      return palettes[0];
   }
}

export default Image;
