import ApiHost from "@/host/ApiHost.js";
import ModuleImage from "./data/Image.js";
import Filename from "./Filename.js";

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

   static Method = ModuleImage.Method;

   method;
   path;

   fromData(data) {
      data = new ModuleImage(data);
      this.method = data.method;
      this.path = data.path;
      return this;
   }
   toData() {
      return new ModuleImage({
         method: this.method,
         path: this.path,
      });
   }
   toCount(strs) {
      return 0;
   }
   toUrl(option = { width: 0, height: 0 }) {
      let { width = 0, height = 0 } =
         typeof option === "object" && option !== null ? option : {};
      let method = this.method;
      let path = this.path;

      if (method && path) {
         if (method === Image.Method.Local) return `${ApiHost.origin}/${path}`;
         if (method === Image.Method.Link) return path;
         if (method === Image.Method.StorageImage) {
            const prefix = "/api/image/name/";
            const name = path.substring(prefix.length, path.length);
            const dimensionQuery = Image.dimensionToQuery(width, height);
            const query = dimensionQuery.length ? `?${dimensionQuery}` : "";
            const filename = new Filename(name);
            return `${ApiHost.origin}/api/image/name/${filename.toString()}${query}`;
         }
      }
      return "";
   }

   async fetchColor() {
      const palettes = await getColors(this.toUrl({ width: 20 }), { count: 1 });
      return palettes[0];
   }
}

export default Image;
