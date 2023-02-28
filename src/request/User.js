import HostApi from "@/host/HostApi.js";

export default class User {
   static list() {
      return HostApi.request().url("users").send();
   }
   static add(username, name, passwordNew, passwordRepeat) {
      return HostApi.request()
         .url("users/user")
         .POST()
         .body({ username, name, passwordNew, passwordRepeat })
         .send();
   }
   static remove(username) {
      return HostApi.request().DELETE().url("users/user").body({ username }).send();
   }
   static update(username, userType) {
      return HostApi.request()
         .url("users/user")
         .PUT()
         .body({ username, userType })
         .send();
   }
}
