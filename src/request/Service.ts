import Server from "@/host/Server";

export default class Service {
  static list(): Promise<any> {
    return Server.request().path("service_v2/get/items").sendJson();
  }
  static import(service: any): Promise<any> {
    return Server.request()
      .POST()
      .path("service_v2/import/item/")
      .bodyJson({ content: service })
      .sendJson();
  }
  static add(service: any): Promise<any> {
    return Server.request()
      .POST()
      .path("service_v2/add/item/")
      .bodyJson({ content: service })
      .sendJson();
  }
  static remove(id: string): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`service_v2/delete/item/${id}`)
      .sendJson();
  }
  static updateState(id: string, state: string): Promise<any> {
    return Server.request()
      .PUT()
      .path(`service_v2/item/${id}/update/state/`)
      .bodyJson({ content: state })
      .sendJson();
  }
  static updateDescription(id: string, description: string): Promise<any> {
    return Server.request()
      .PUT()
      .path(`service_v2/item/${id}/update/description/`)
      .bodyJson({ content: description })
      .sendJson();
  }
  static updateBelongings(id: string, belongings: any[]): Promise<any> {
    return Server.request()
      .PUT()
      .path(`service_v2/item/${id}/update/belonging/`)
      .bodyJson({ content: belongings })
      .sendJson();
  }
  static updateCustomer(id: string, customer: any): Promise<any> {
    return Server.request()
      .PUT()
      .path(`service_v2/item/${id}/update/customer/`)
      .bodyJson({ content: customer })
      .sendJson();
  }
  static addEvent(id: string, event: any): Promise<any> {
    return Server.request()
      .POST()
      .path(`service_v2/item/${id}/add/event/`)
      .bodyJson({ content: event })
      .sendJson();
  }
  static removeEvent(id: string, eventTime: number): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`service_v2/item/${id}/delete/event/`)
      .bodyJson({ serviceID: id, time: eventTime })
      .sendJson();
  }
  static updateEventDescription(
    id: string,
    eventTime: number,
    description: string,
  ): Promise<any> {
    return Server.request()
      .PUT()
      .path(`service_v2/item/${id}/update/event/description`)
      .bodyJson({ serviceID: id, time: eventTime, description })
      .sendJson();
  }
  static addLabel(id: string, label: any): Promise<any> {
    return Server.request()
      .POST()
      .path(`service_v2/item/${id}/add/label/`)
      .bodyJson({ label })
      .sendJson();
  }
  static removeLabel(id: string, label: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`service_v2/item/${id}/delete/label/`)
      .bodyJson({ label: label.toData() })
      .sendJson();
  }
  static addImageTemp(imageFormData: any): Promise<any> {
    return Server.request()
      .POST()
      .path(`service_v2/add/image_files_temp/`)
      .body(imageFormData)
      .send();
  }
  static addImage(id: string, imageForm: any): Promise<any> {
    return Server.request()
      .POST()
      .path(`service_v2/item/${id}/add/image_files/`)
      .body(imageForm)
      .send();
  }
  static addEventImage(
    id: string,
    eventTime: number,
    imageForm: any,
  ): Promise<any> {
    return Server.request()
      .POST()
      .path(`service_v2/item/${id}/add/event/${eventTime}/image_files/`)
      .body(imageForm)
      .send();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`service_v2/item/${id}/delete/image/`)
      .bodyJson({ content: image.toData() })
      .sendJson();
  }
  static removeEventImage(serviceId: string, eventTime: number, image: any) {
    return Server.request()
      .DELETE()
      .path(`service_v2/item/${serviceId}/delete/event/${eventTime}/image/`)
      .bodyJson({ image: image.toData() })
      .sendJson();
  }
}
