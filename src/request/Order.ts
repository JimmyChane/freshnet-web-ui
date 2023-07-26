import HostApi from "@/host/HostApi";

export default class Order {
  static list(): Promise<any> {
    return HostApi.request().url("order/").send();
  }
  static add(body: any): Promise<any> {
    return HostApi.request().POST().url("order/").body(body).send();
  }
  static delete(id: string): Promise<any> {
    return HostApi.request().DELETE().url("order/").body({ id }).send();
  }
  static updateStatus(id: string, status: number): Promise<any> {
    return HostApi.request().PUT().url("order/").body({ id, status }).send();
  }
}
