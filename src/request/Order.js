import HostApi from "@/host/HostApi.js";

export default class Order {
   static list() {
      return HostApi.request().url("order/").send();
   }
   static add(body) {
      return HostApi.request().POST().url("order/").body(body).send();
   }
   static delete(id) {
      return HostApi.request().DELETE().url("order/").body({ id }).send();
   }
   static updateStatus(id, status) {
      return HostApi.request().PUT().url("order/").body({ id, status }).send();
   }
}
