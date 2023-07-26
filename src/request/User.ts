import HostApi from "@/host/HostApi";

export default class User {
  static list(): Promise<any> {
    return HostApi.request().url("users").send();
  }
  static add(
    username: string,
    name: string,
    passwordNew: string,
    passwordRepeat: string,
  ): Promise<any> {
    return HostApi.request()
      .url("users/user")
      .POST()
      .body({ username, name, passwordNew, passwordRepeat })
      .send();
  }
  static remove(username: string): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url("users/user")
      .body({ username })
      .send();
  }
  static update(username: string, userType: string): Promise<any> {
    return HostApi.request()
      .url("users/user")
      .PUT()
      .body({ username, userType })
      .send();
  }
}
