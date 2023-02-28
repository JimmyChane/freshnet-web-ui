import HostApi from "@/host/HostApi.js";

export default class Specification {
   static list() {
      return HostApi.request().url("spec/").send();
   }
}
