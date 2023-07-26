import HostApi from "@/host/HostApi";

export default class Ps2 {
  static listDisc(): Promise<any> {
    return HostApi.request().url("ps2/disc/").send();
  }
}
