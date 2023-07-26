import HostApi from "@/host/HostApi";

export default class Device {
  static list(): Promise<any> {
    return HostApi.request().url("customer/device/list").send();
  }
  static add(body: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("customer/device/add")
      .body(body)
      .send();
  }
  static remove(body: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url("customer/device/remove")
      .body(body)
      .send();
  }
  static updateSpecification(body: any): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("customer/device/update/specifications")
      .body(body)
      .send();
  }
  static updateDescription(body: any): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("customer/device/update/description")
      .body(body)
      .send();
  }
}
