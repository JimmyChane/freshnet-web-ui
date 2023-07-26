import HostApi from "@/host/HostApi";

export default class Database {
  static info(): Promise<any> {
    return HostApi.request().POST().url("database/info").send();
  }

  static databases(): Promise<any> {
    return HostApi.request().POST().url("database/databases").send();
  }

  static collections(database: string): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`database/database/${database}/collections`)
      .send();
  }

  static documents(database: string, collection: string): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`database/database/${database}/collection/${collection}/documents`)
      .send();
  }

  static import(body: any): Promise<any> {
    return HostApi.request().POST().url("database/imports").body(body).send();
  }

  static export(database: string): Promise<any> {
    return HostApi.request()
      .url(`database/database/${database}/exportv2`)
      .send();
  }
}
