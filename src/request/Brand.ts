import Server from "@/host/Server";

export default class Brand {
  static list(): Promise<any> {
    return Server.request().path("brand/").sendJson();
  }
}
