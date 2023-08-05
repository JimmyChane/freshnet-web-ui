import Server from "@/host/Server";

export default class Category {
  static list(): Promise<any> {
    return Server.request().path("productv2/category/list/").sendJson();
  }
}
