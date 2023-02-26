import HostApi from "@/host/HostApi.js";

export default class Device {
   static list() {
      return HostApi.request().url("customer/device/list").send();
   }
   static add(body) {
      return HostApi.request().POST().url("customer/device/add").body(body).send();
   }
   static remove(body) {
      return HostApi.request().DELETE().url("customer/device/remove").body(body).send();
   }
   static updateSpecification(body) {
      return HostApi.request()
         .PUT()
         .url("customer/device/update/specifications")
         .body(body)
         .send();
   }
   static updateDescription(body) {
      return HostApi.request()
         .PUT()
         .url("customer/device/update/description")
         .body(body)
         .send();
   }
}
