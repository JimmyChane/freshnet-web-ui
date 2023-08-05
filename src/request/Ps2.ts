import Server from "@/host/Server";

export default class Ps2 {
  static listDisc(): Promise<any> {
    return Server.request().path("ps2/disc/").sendJson();
  }
}
