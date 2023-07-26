import HostApi from "@/host/HostApi";
export default class Customer {
    static list() {
        return HostApi.request().url("customer/list").send();
    }
    static add(content = {}) {
        return HostApi.request()
            .POST()
            .url("customer/add")
            .body({ content })
            .send();
    }
    static remove(id = "") {
        return HostApi.request()
            .DELETE()
            .url("customer/remove")
            .body({ content: { _id: id } })
            .send();
    }
    static updateNamePhoneNumber(id = "", name = "", phoneNumber = "") {
        return HostApi.request()
            .PUT()
            .url("customer/update/namePhoneNumber")
            .body({ content: { _id: id, name, phoneNumber } })
            .send();
    }
    static updateDescription(id = "", description = "") {
        return HostApi.request()
            .PUT()
            .url("customer/update/description")
            .body({ content: { id, description } })
            .send();
    }
}
