import HostApi from "@/host/HostApi";
export default class Database {
    static info() {
        return HostApi.request().POST().url("database/info").send();
    }
    static databases() {
        return HostApi.request().POST().url("database/databases").send();
    }
    static collections(database) {
        return HostApi.request()
            .POST()
            .url(`database/database/${database}/collections`)
            .send();
    }
    static documents(database, collection) {
        return HostApi.request()
            .POST()
            .url(`database/database/${database}/collection/${collection}/documents`)
            .send();
    }
    static import(body) {
        return HostApi.request().POST().url("database/imports").body(body).send();
    }
    static export(database) {
        return HostApi.request()
            .url(`database/database/${database}/exportv2`)
            .send();
    }
}
