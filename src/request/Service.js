import HostApi from "@/host/HostApi.js";

export default class Service {
   static list() {
      return HostApi.request().url("service_v2/get/items").send();
   }
   static import(service) {
      return HostApi.request()
         .POST()
         .url("service_v2/import/item/")
         .body({ content: service })
         .send();
   }
   static add(service) {
      return HostApi.request()
         .POST()
         .url("service_v2/add/item/")
         .body({ content: service })
         .send();
   }
   static remove(id) {
      return HostApi.request()
         .DELETE()
         .url(`service_v2/delete/item/${id}`)
         .send();
   }
   static updateState(id, state) {
      return HostApi.request()
         .PUT()
         .url(`service_v2/item/${id}/update/state/`)
         .body({ content: state })
         .send();
   }
   static updateDescription(id, description) {
      return HostApi.request()
         .PUT()
         .url(`service_v2/item/${id}/update/description/`)
         .body({ content: description })
         .send();
   }
   static updateBelongings(id, belongings) {
      return HostApi.request()
         .PUT()
         .url(`service_v2/item/${id}/update/belonging/`)
         .body({ content: belongings })
         .send();
   }
   static updateCustomer(id, customer) {
      return HostApi.request()
         .PUT()
         .url(`service_v2/item/${id}/update/customer/`)
         .body({ content: customer })
         .send();
   }
   static addEvent(id, event) {
      return HostApi.request()
         .POST()
         .url(`service_v2/item/${id}/add/event/`)
         .body({ content: event })
         .send();
   }
   static removeEvent(id, eventTime) {
      return HostApi.request()
         .DELETE()
         .url(`service_v2/item/${id}/delete/event/`)
         .body({ serviceID: id, time: eventTime })
         .send();
   }
   static updateEventDescription(id, eventTime, description) {
      return HostApi.request()
         .PUT()
         .url(`service_v2/item/${id}/update/event/description`)
         .body({ serviceID: id, time: eventTime, description })
         .send();
   }
   static addLabel(id, label) {
      return HostApi.request()
         .POST()
         .url(`service_v2/item/${id}/add/label/`)
         .body({ label })
         .send();
   }
   static removeLabel(id, label) {
      return HostApi.request()
         .DELETE()
         .url(`service_v2/item/${id}/delete/label/`)
         .body({ label: label.toData() })
         .send();
   }
   static addImageTemp(imageFormData) {
      return HostApi.request()
         .POST()
         .url(`service_v2/add/image_files_temp/`)
         .bodyObject(imageFormData)
         .sendNotJson();
   }
   static addImage(id, imageForm) {
      return HostApi.request()
         .POST()
         .url(`service_v2/item/${id}/add/image_files/`)
         .bodyObject(imageForm)
         .sendNotJson();
   }
   static removeImage(id, image) {
      return HostApi.request()
         .DELETE()
         .url(`service_v2/item/${id}/delete/image/`)
         .body({ content: image.toData() })
         .send();
   }
}
