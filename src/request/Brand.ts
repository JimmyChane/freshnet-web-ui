import HostApi from "@/host/HostApi";

export default class Brand {
  static list(): Promise<any> {
    return HostApi.request().url("brand/").send();
  }
}
