import HostApi from "@/host/HostApi.js";

export default class Login {
   static login(body) {
      return HostApi.request().POST().url("session/login/").body(body).send();
   }
   static user(token) {
      return HostApi.request().POST().url("session/verifyToken/").body({ token }).send();
   }
   static updatePassword(username, passwordVerify, passwordNew) {
      return HostApi.request()
         .POST()
         .url(`session/user/${username}/changePassword`)
         .body({ passwordVerify, passwordNew })
         .send();
   }
}
