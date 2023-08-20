import Server from "@/host/Server";

export default class Setting {
  static list(): Promise<any> {
    return Server.request().path("settingv3").sendJson();
  }
  static update(setting: any): Promise<any> {
    return Server.request().PUT().path("settingv3/system").bodyJson(setting).sendJson();
  }
}
