import HostApi from "@/host/HostApi";

export default class Service {
  static list(): Promise<any> {
    return HostApi.request().url("service_v2/get/items").send();
  }
  static import(service: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("service_v2/import/item/")
      .body({ content: service })
      .send();
  }
  static add(service: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url("service_v2/add/item/")
      .body({ content: service })
      .send();
  }
  static remove(id: string): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url(`service_v2/delete/item/${id}`)
      .send();
  }
  static updateState(id: string, state: string): Promise<any> {
    return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/state/`)
      .body({ content: state })
      .send();
  }
  static updateDescription(id: string, description: string): Promise<any> {
    return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/description/`)
      .body({ content: description })
      .send();
  }
  static updateBelongings(id: string, belongings: any[]): Promise<any> {
    return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/belonging/`)
      .body({ content: belongings })
      .send();
  }
  static updateCustomer(id: string, customer: any): Promise<any> {
    return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/customer/`)
      .body({ content: customer })
      .send();
  }
  static addEvent(id: string, event: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/event/`)
      .body({ content: event })
      .send();
  }
  static removeEvent(id: string, eventTime: number): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${id}/delete/event/`)
      .body({ serviceID: id, time: eventTime })
      .send();
  }
  static updateEventDescription(
    id: string,
    eventTime: number,
    description: string,
  ): Promise<any> {
    return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/event/description`)
      .body({ serviceID: id, time: eventTime, description })
      .send();
  }
  static addLabel(id: string, label: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/label/`)
      .body({ label })
      .send();
  }
  static removeLabel(id: string, label: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${id}/delete/label/`)
      .body({ label: label.toData() })
      .send();
  }
  static addImageTemp(imageFormData: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`service_v2/add/image_files_temp/`)
      .bodyObject(imageFormData)
      .sendNotJson();
  }
  static addImage(id: string, imageForm: any): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/image_files/`)
      .bodyObject(imageForm)
      .sendNotJson();
  }
  static addEventImage(
    id: string,
    eventTime: number,
    imageForm: any,
  ): Promise<any> {
    return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/event/${eventTime}/image_files/`)
      .bodyObject(imageForm)
      .sendNotJson();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${id}/delete/image/`)
      .body({ content: image.toData() })
      .send();
  }
  static removeEventImage(serviceId: string, eventTime: number, image: any) {
    return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${serviceId}/delete/event/${eventTime}/image/`)
      .body({ image: image.toData() })
      .send();
  }
}
