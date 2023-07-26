import HostApi from "@/host/HostApi";

export default class Setting {
  static list(): Promise<any> {
    return HostApi.request().url("settingv3").send();
  }
  static update(setting: any): Promise<any> {
    return HostApi.request().PUT().url("settingv3/system").body(setting).send();
  }
}
