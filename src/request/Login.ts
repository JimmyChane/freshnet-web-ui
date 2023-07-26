import HostApi from "@/host/HostApi";

export default class Login {
  static login(body: any): Promise<any> {
    return HostApi.request().POST().url("session/login/").body(body).send();
  }
  static user(token: string): Promise<any> {
    return HostApi.request()
      .POST()
      .url("session/verifyToken/")
      .body({ token })
      .send();
  }
  static updatePassword(
    username: string,
    passwordVerify: string,
    passwordNew: string,
  ): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`session/user/${username}/changePassword`)
      .body({ passwordVerify, passwordNew })
      .send();
  }
}
