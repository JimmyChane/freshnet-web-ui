import Server from "@/host/Server";

export default class Login {
  static login(body: any): Promise<any> {
    return Server.request().POST().path("session/login/").bodyJson(body).sendJson();
  }
  static user(token: string): Promise<any> {
    return Server.request()
      .POST()
      .path("session/verifyToken/")
      .bodyJson({ token })
      .sendJson();
  }
  static updatePassword(
    username: string,
    passwordVerify: string,
    passwordNew: string,
  ): Promise<any> {
    return Server.request()
      .POST()
      .path(`session/user/${username}/changePassword`)
      .bodyJson({ passwordVerify, passwordNew })
      .sendJson();
  }
}
