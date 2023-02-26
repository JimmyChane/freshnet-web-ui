import HostApi from "@/host/HostApi.js";

export default class Brand {
   static list() {
      return HostApi.request().url("brand/").send();
   }
}
