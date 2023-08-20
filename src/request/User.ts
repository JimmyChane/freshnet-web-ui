import Server from "@/host/Server";

export default class User {
  static list(): Promise<any> {
    return Server.request().path("users").sendJson();
  }
  static add(
    username: string,
    name: string,
    passwordNew: string,
    passwordRepeat: string,
  ): Promise<any> {
    return Server.request()
      .path("users/user")
      .POST()
      .bodyJson({ username, name, passwordNew, passwordRepeat })
      .sendJson();
  }
  static remove(username: string): Promise<any> {
    return Server.request()
      .DELETE()
      .path("users/user")
      .bodyJson({ username })
      .sendJson();
  }
  static update(username: string, userType: string): Promise<any> {
    return Server.request()
      .path("users/user")
      .PUT()
      .bodyJson({ username, userType })
      .sendJson();
  }
}
