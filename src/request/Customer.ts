import Server from "@/host/Server";

interface CustomerContent {
  _id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
}

export default class Customer {
  static list(): Promise<any> {
    return Server.request().path("customer/list").sendJson();
  }

  static add(content: CustomerContent = {}): Promise<any> {
    return Server.request()
      .POST()
      .path("customer/add")
      .bodyJson({ content })
      .sendJson();
  }

  static remove(id: string = ""): Promise<any> {
    return Server.request()
      .DELETE()
      .path("customer/remove")
      .bodyJson({ content: { _id: id } })
      .sendJson();
  }

  static updateNamePhoneNumber(
    id: string = "",
    name: string = "",
    phoneNumber: string = "",
  ): Promise<any> {
    return Server.request()
      .PUT()
      .path("customer/update/namePhoneNumber")
      .bodyJson({ content: { _id: id, name, phoneNumber } })
      .sendJson();
  }

  static updateDescription(
    id: string = "",
    description: string = "",
  ): Promise<any> {
    return Server.request()
      .PUT()
      .path("customer/update/description")
      .bodyJson({ content: { id, description } })
      .sendJson();
  }
}
