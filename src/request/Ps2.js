import HostApi from "@/host/HostApi.js";

export default class Ps2 {
   static listDisc() {
      return HostApi.request().url("ps2/disc/").send();
   }
}
