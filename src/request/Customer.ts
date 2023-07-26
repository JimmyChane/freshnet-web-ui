import HostApi from "@/host/HostApi";

interface CustomerContent {
  _id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
}

export default class Customer {
  static list(): Promise<any> {
    return HostApi.request().url("customer/list").send();
  }

  static add(content: CustomerContent = {}): Promise<any> {
    return HostApi.request()
      .POST()
      .url("customer/add")
      .body({ content })
      .send();
  }

  static remove(id: string = ""): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url("customer/remove")
      .body({ content: { _id: id } })
      .send();
  }

  static updateNamePhoneNumber(
    id: string = "",
    name: string = "",
    phoneNumber: string = "",
  ): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("customer/update/namePhoneNumber")
      .body({ content: { _id: id, name, phoneNumber } })
      .send();
  }

  static updateDescription(
    id: string = "",
    description: string = "",
  ): Promise<any> {
    return HostApi.request()
      .PUT()
      .url("customer/update/description")
      .body({ content: { id, description } })
      .send();
  }
}
