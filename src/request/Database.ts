import Server from "@/host/Server";

export default class Database {
  static info(): Promise<any> {
    return Server.request().POST().path("database/info").sendJson();
  }

  static databases(): Promise<any> {
    return Server.request().POST().path("database/databases").sendJson();
  }

  static collections(database: string): Promise<any> {
    return Server.request()
      .POST()
      .path(`database/database/${database}/collections`)
      .sendJson();
  }

  static documents(database: string, collection: string): Promise<any> {
    return Server.request()
      .POST()
      .path(`database/database/${database}/collection/${collection}/documents`)
      .sendJson();
  }

  static import(body: any): Promise<any> {
    return Server.request().POST().path("database/imports").bodyJson(body).sendJson();
  }

  static export(database: string): Promise<any> {
    return Server.request()
      .path(`database/database/${database}/exportv2`)
      .sendJson();
  }
}
