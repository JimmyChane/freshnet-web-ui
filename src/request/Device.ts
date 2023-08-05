import Server from "@/host/Server";

export default class Device {
  static list(): Promise<any> {
    return Server.request().path("customer/device/list").sendJson();
  }
  static add(body: any): Promise<any> {
    return Server.request()
      .POST()
      .path("customer/device/add")
      .bodyJson(body)
      .sendJson();
  }
  static remove(body: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path("customer/device/remove")
      .bodyJson(body)
      .sendJson();
  }
  static updateSpecification(body: any): Promise<any> {
    return Server.request()
      .PUT()
      .path("customer/device/update/specifications")
      .bodyJson(body)
      .sendJson();
  }
  static updateDescription(body: any): Promise<any> {
    return Server.request()
      .PUT()
      .path("customer/device/update/description")
      .bodyJson(body)
      .sendJson();
  }
}
