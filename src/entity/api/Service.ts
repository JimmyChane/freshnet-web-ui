import { API_SERVER } from '@/entity/Server';

export function getServiceList(): Promise<any> {
  return API_SERVER.request().path('service_v2/get/items').sendJson();
}
export function importService(service: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path('service_v2/import/item/')
    .bodyJson({ content: service })
    .sendJson();
}
export function addService(service: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path('service_v2/add/item/')
    .bodyJson({ content: service })
    .sendJson();
}
export function removeService(id: string): Promise<any> {
  return API_SERVER.request()
    .DELETE()
    .path(`service_v2/delete/item/${id}`)
    .sendJson();
}

export function updateServiceState(id: string, state: string): Promise<any> {
  return API_SERVER.request()
    .PUT()
    .path(`service_v2/item/${id}/update/state/`)
    .bodyJson({ content: state })
    .sendJson();
}
export function updateServiceDescription(
  id: string,
  description: string,
): Promise<any> {
  return API_SERVER.request()
    .PUT()
    .path(`service_v2/item/${id}/update/description/`)
    .bodyJson({ content: description })
    .sendJson();
}
export function updateServiceBelongings(
  id: string,
  belongings: any[],
): Promise<any> {
  return API_SERVER.request()
    .PUT()
    .path(`service_v2/item/${id}/update/belonging/`)
    .bodyJson({ content: belongings })
    .sendJson();
}
export function updateServiceCustomer(id: string, customer: any): Promise<any> {
  return API_SERVER.request()
    .PUT()
    .path(`service_v2/item/${id}/update/customer/`)
    .bodyJson({ content: customer })
    .sendJson();
}
export function addServiceEvent(id: string, event: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`service_v2/item/${id}/add/event/`)
    .bodyJson({ content: event })
    .sendJson();
}
export function removeServiceEvent(
  id: string,
  eventTime: number,
): Promise<any> {
  return API_SERVER.request()
    .DELETE()
    .path(`service_v2/item/${id}/delete/event/`)
    .bodyJson({ serviceID: id, time: eventTime })
    .sendJson();
}
export function updateServiceEventDescription(
  id: string,
  eventTime: number,
  description: string,
): Promise<any> {
  return API_SERVER.request()
    .PUT()
    .path(`service_v2/item/${id}/update/event/description`)
    .bodyJson({ serviceID: id, time: eventTime, description })
    .sendJson();
}
export function addServiceLabel(id: string, label: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`service_v2/item/${id}/add/label/`)
    .bodyJson({ label })
    .sendJson();
}
export function removeServiceLabel(id: string, label: any): Promise<any> {
  return API_SERVER.request()
    .DELETE()
    .path(`service_v2/item/${id}/delete/label/`)
    .bodyJson({ label: label.toData() })
    .sendJson();
}
export function addServiceImageTemp(imageFormData: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`service_v2/add/image_files_temp/`)
    .body(imageFormData)
    .send();
}
export function addServiceImage(id: string, imageForm: any): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`service_v2/item/${id}/add/image_files/`)
    .body(imageForm)
    .send();
}
export function addServiceEventImage(
  id: string,
  eventTime: number,
  imageForm: any,
): Promise<any> {
  return API_SERVER.request()
    .POST()
    .path(`service_v2/item/${id}/add/event/${eventTime}/image_files/`)
    .body(imageForm)
    .send();
}
export function removeServiceImage(id: string, image: any): Promise<any> {
  return API_SERVER.request()
    .DELETE()
    .path(`service_v2/item/${id}/delete/image/`)
    .bodyJson({ content: image.toData() })
    .sendJson();
}
export function removeServiceEventImage(
  serviceId: string,
  eventTime: number,
  image: any,
) {
  return API_SERVER.request()
    .DELETE()
    .path(`service_v2/item/${serviceId}/delete/event/${eventTime}/image/`)
    .bodyJson({ image: image.toData() })
    .sendJson();
}
