import HostApi from "@/host/HostApi";
import Filename from "../objects/Filename";
import Image from "./Image";

class ServiceImage {
   stores;
   loginStore;

   constructor(stores) {
      this.stores = stores;
      this.loginStore = stores.login;
   }

   name = "";
   path = "";
   method = "";
   storageType = "";

   fromData(data) {
      this.name = data.name;
      this.path = data.path;
      this.method = data.method;
      this.storageType = data.storageType;
      return this;
   }
   toData() {
      return {
         name: this.name,
         path: this.path,
         method: this.method,
         storageType: this.storageType,
      };
   }
   toCount(strs) {
      return 0;
   }
   toUrl(option = { width: 0, height: 0 }) {
      const { path, method } = this;
      const dimensionQuery = Image.dimensionToQuery(option.width, option.height);
      const query = dimensionQuery.length ? `?${dimensionQuery}` : "";

      if (method === Image.Method.StorageImage) {
         const prefix = "/api/image/name/";
         const name = path.substring(prefix.length, path.length);
         const filename = new Filename(name);
         return `${HostApi.originApi}/image/name/${filename.toString()}${query}`;
      }

      const filename = new Filename(this.name);
      return `${HostApi.originApi}/service_v2/get/image/${filename.toString()}${query}`;
   }
   async toBlob(option = { width: 0, height: 0 }) {
      const url = this.toUrl(option);
      const options = { headers: { "authorization": this.loginStore.getters.token } };
      const response = await fetch(url, options);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
   }
}

export default ServiceImage;
