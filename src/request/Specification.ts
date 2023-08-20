import Server from "@/host/Server";

export default class Specification {
  static list(): Promise<any> {
    return Server.request().path("spec/").sendJson();
  }
}
