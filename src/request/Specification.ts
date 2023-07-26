import HostApi from "@/host/HostApi";

export default class Specification {
  static list(): Promise<any> {
    return HostApi.request().url("spec/").send();
  }
}
