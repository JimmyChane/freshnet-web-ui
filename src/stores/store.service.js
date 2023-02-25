import Service from "@/items/Service.js";
import ServiceImage from "@/items/ServiceImage";
import Vuex from "vuex";
import ServiceModule from "@/items/data/Service.js";
import HostApi from "@/host/HostApi.js";
import ServiceCustomer from "@/items/ServiceCustomer";
import ServiceEvent from "@/items/ServiceEvent";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import ServiceLabel from "@/items/data/ServiceLabel";

const Notify = {
   ItemAdd: "item-add",
   ItemRemove: "item-remove",
   ItemImageAdd: "item-image-add",
   ItemImageRemove: "item-image-remove",
   ItemEventAdd: "item-event-add",
   ItemEventRemove: "item-event-remove",
   ItemLabelAdd: "item-label-add",
   ItemLabelRemove: "item-label-remove",
   ItemStateUpdate: "item-state-update",
   ItemDescriptionUpdate: "item-description-update",
   ItemBelongingsUpdate: "item-belongings-update",
   ItemCustomerUpdate: "item-customer-update",
};

const requestList = async () => {
   return HostApi.request().url("service_v2/get/items").send();
};
const requestImport = async (service) => {
   return HostApi.request()
      .POST()
      .url("service_v2/import/item/")
      .body({ content: service })
      .send();
};
const requestAdd = async (service) => {
   return HostApi.request()
      .POST()
      .url("service_v2/add/item/")
      .body({ content: service })
      .send();
};
const requestRemove = async (id) => {
   return HostApi.request().DELETE().url(`service_v2/delete/item/${id}`).send();
};
const requestUpdateState = async (id, state) => {
   return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/state/`)
      .body({ content: state })
      .send();
};
const requestUpdateDescription = async (id, description) => {
   return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/description/`)
      .body({ content: description })
      .send();
};
const requestUpdateBelongings = async (id, belongings) => {
   return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/belonging/`)
      .body({ content: belongings })
      .send();
};
const requestUpdateCustomer = async (id, customer) => {
   return HostApi.request()
      .PUT()
      .url(`service_v2/item/${id}/update/customer/`)
      .body({ content: customer })
      .send();
};
const requestAddEvent = async (id, event) => {
   return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/event/`)
      .body({ content: event })
      .send();
};
const requestRemoveEvent = async (id, eventTime) => {
   return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${id}/delete/event/`)
      .body({ serviceID: id, time: eventTime })
      .send();
};
const requestAddLabel = async (id, label) => {
   return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/label/`)
      .body({ label })
      .send();
};
const requestRemoveLabel = async (id, label) => {
   return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${id}/delete/label/`)
      .body({ label: label.toData() })
      .send();
};
const requestAddImage = async (id, imageForm) => {
   return HostApi.request()
      .POST()
      .url(`service_v2/item/${id}/add/image_files/`)
      .bodyObject(imageForm)
      .sendNotJson();
};
const requestRemoveImage = async (id, image) => {
   return HostApi.request()
      .DELETE()
      .url(`service_v2/item/${id}/delete/image/`)
      .body({ content: image.toData() })
      .send();
};

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await requestList();
      const error = api.getError();
      if (error) throw new Error(error);
      return U.optArray(api.getContent()).map((content) => {
         return new Service(Stores).fromData(content);
      });
   });
   context.onGetStore(() => Stores.service);
   context.build();
   context.actions.socketNotify = (context, data) => {
      const { key, content } = data;

      if (key === Notify.ItemAdd) {
         const inputItem = new Service(Stores).fromData(content);
         context.state.list.addItem(inputItem);
      }
      if (key === Notify.ItemRemove) {
         const inputItem = new Service(Stores).fromData(content);
         context.state.list.removeItemByItem(inputItem);
      }
      if (key === Notify.ItemImageAdd) {
         const { id, images } = content;
         context.state.list.updateItemById(id, (item) => {
            images
               .map((dataImage) => new ServiceImage(Stores).fromData(dataImage))
               .forEach((image) => {
                  const existingImage = item.imageFiles.find((img) => {
                     return img.name === image.name;
                  });
                  if (!existingImage) item.imageFiles.push(image);
               });
         });
      }
      if (key === Notify.ItemImageRemove) {
         const { id, image } = content;
         context.state.list.updateItemById(id, (item) => {
            item.imageFiles = item.imageFiles.filter((imageFile) => {
               return imageFile.name !== image.name;
            });
         });
      }
      if (key === Notify.ItemEventAdd) {
         const { id, event } = content;
         context.state.list.updateItemById(id, (item) => {
            if (!item) return inputItem;
            const inputEvent = new ServiceEvent(Stores).fromData(event);
            const found = item.events.find((itemEvent) => {
               return itemEvent.timestamp.time === inputEvent.timestamp.time;
            });
            if (!found) {
               item.events.push(inputEvent);
               item.events.sort((event1, event2) => event1.compare(event2));
            }
         });
      }
      if (key === Notify.ItemEventRemove) {
         const { id, event } = content;
         context.state.list.updateItemById(id, (item) => {
            const inputEvent = new ServiceEvent(Stores).fromData(event);
            const found = item.events.find((itemEvent) => {
               return itemEvent.timestamp.time === inputEvent.timestamp.time;
            });
            if (found) item.events.splice(item.events.indexOf(found), 1);
         });
      }
      if (key === Notify.ItemLabelAdd) {
         const { id, label } = content;
         context.state.list.updateItemById(id, (item) => {
            if (label.title === "Urgent") item.setUrgent(true);
            if (label.title === "Warranty") item.setWarranty(true);
         });
      }
      if (key === Notify.ItemLabelRemove) {
         const { id, label } = content;
         context.state.list.updateItemById(id, (item) => {
            if (label.title === "Urgent") item.setUrgent(false);
            if (label.title === "Warranty") item.setWarranty(false);
         });
      }
      if (key === Notify.ItemStateUpdate) {
         const { id, state } = content;
         context.state.list.updateItemById(id, (item) => {
            item.state = state;
         });
      }
      if (key === Notify.ItemDescriptionUpdate) {
         const { id, description } = content;
         context.state.list.updateItemById(id, (item) => {
            item.description = description;
         });
      }
      if (key === Notify.ItemBelongingsUpdate) {
         const { id, belongings } = content;
         context.state.list.updateItemById(id, (item) => {
            item.belongings = belongings;
         });
      }
      if (key === Notify.ItemCustomerUpdate) {
         const { id, customer } = content;
         context.state.list.updateItemById(id, (item) => {
            item.customer = new ServiceCustomer(Stores).fromData(customer);
         });
      }
   };
   context.actions.refresh = async (context) => {
      return context.state.processor.acquire("refresh", async () => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      });
   };
   context.actions.getItems = async (context) => {
      return context.state.processor.acquire("getItems", async () => {
         return context.state.dataLoader.data();
      });
   };
   context.actions.getItemOfId = async (context, id = "") => {
      return context.state.processor.acquire("getItemOfId", async () => {
         let items = await context.dispatch("getItems");
         return items.find((service) => service.id === id);
      });
   };
   context.actions.getGroupsByCustomer = async (context) => {
      const items = await context.dispatch("getItems");
      const groups = items.reduce((groups, item) => {
         let group = groups.find((group) => {
            return group.customer.isEqual(item.customer);
         });

         if (!group) {
            group = { customer: item.customer, items: [] };
            groups.push(group);
         }

         group.items.push(item);
         return groups;
      }, []);

      return groups;
   };

   const updateContent = async (promise) => {
      const api = await promise;
      const error = api.getError();
      if (error) throw new Error();
      return api.getContent();
   };

   context.actions.importItem = async (context, arg = { data }) => {
      return context.state.processor.acquire("importItem", async () => {
         const { data } = arg;
         if (!data) throw new Error();
         const service = ServiceModule.trim(data);

         const content = await updateContent(requestImport(service));
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.addItem(inputItem);
      });
   };
   context.actions.addItem = async (context, arg = { data }) => {
      return context.state.processor.acquire("addItem", async () => {
         const { data } = arg;
         if (!data) return null;
         if (!data) throw new Error("invalid data");

         const content = await updateContent(requestAdd(data));
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.addItem(inputItem);
      });
   };
   context.actions.removeItemOfId = async (context, arg = { id }) => {
      return context.state.processor.acquire("removeItemOfId", async () => {
         const { id } = arg;
         await updateContent(requestRemove(id));
         return context.state.list.removeItemById(id);
      });
   };
   context.actions.updateStateOfId = async (context, arg = { serviceID, state }) => {
      return context.state.processor.acquire("updateStateOfId", async () => {
         const { serviceID, state } = arg;

         await updateContent(requestUpdateState(serviceID, state));
         return context.state.list.updateItemById(serviceID, (item) => {
            item.state = state;
         });
      });
   };
   context.actions.updateDescriptionOfId = async (
      context,
      arg = { serviceID, description },
   ) => {
      return context.state.processor.acquire("updateDescriptionOfId", async () => {
         const { serviceID, description } = arg;

         await updateContent(requestUpdateDescription(serviceID, description));
         return context.state.list.updateItemById(serviceID, (item) => {
            item.description = description;
         });
      });
   };
   context.actions.updateBelongingsOfId = async (
      context,
      arg = { serviceID, belongings },
   ) => {
      return context.state.processor.acquire("updateBelongingsOfId", async () => {
         const { serviceID, belongings } = arg;
         const content = await updateContent(
            requestUpdateBelongings(serviceID, belongings),
         );
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item) return inputItem;
            item.belongings = inputItem.belongings;
         });
      });
   };
   context.actions.updateCustomerOfId = async (
      context,
      arg = { serviceID, customer },
   ) => {
      return context.state.processor.acquire("updateCustomerOfId", async () => {
         const { serviceID, customer } = arg;
         const content = await updateContent(requestUpdateCustomer(serviceID, customer));
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item) return inputItem;
            item.customer = inputItem.customer;
         });
      });
   };
   context.actions.addEventToId = async (context, arg = { serviceID, data }) => {
      return context.state.processor.acquire("addEventToId", async () => {
         const { serviceID, data } = arg;
         if (!serviceID || !data) return null;
         const content = await updateContent(requestAddEvent(serviceID, data));
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item) return inputItem;
            item.events = inputItem.events.sort((event1, event2) => {
               return event1.compare(event2);
            });
         });
      });
   };
   context.actions.removeEventFromId = async (context, arg = { serviceID, time }) => {
      return context.state.processor.acquire("removeEventFromId", async () => {
         const { serviceID, time } = arg;

         await updateContent(requestRemoveEvent(serviceID, time));
         return context.state.list.updateItemById(serviceID, (item) => {
            item.events = item.events.filter((event) => {
               return event.timestamp.time !== time;
            });
         });
      });
   };
   context.actions.updateUrgentOfId = async (context, arg = { serviceID, isUrgent }) => {
      const label = ServiceLabel.Defaults.Urgent;
      if (arg.isUrgent) {
         return context.dispatch("addLabelToId", { serviceID: arg.serviceID, label });
      } else {
         return context.dispatch("removeLabelFromId", {
            serviceID: arg.serviceID,
            label,
         });
      }
   };
   context.actions.updateWarrantyOfId = async (
      context,
      arg = { serviceID, isWarranty },
   ) => {
      const label = ServiceLabel.Defaults.Warranty;
      if (arg.isUrgent) {
         return context.dispatch("addLabelToId", { serviceID: arg.serviceID, label });
      } else {
         return context.dispatch("removeLabelFromId", {
            serviceID: arg.serviceID,
            label,
         });
      }
   };
   context.actions.addLabelToId = async (context, arg = { serviceID, label }) => {
      return context.state.processor.acquire("addLabelToId", async () => {
         const { serviceID, label } = arg;
         const content = await updateContent(requestAddLabel(serviceID, label));
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            if (label.title === "Urgent") item.setUrgent(inputItem.isUrgent());
            if (label.title === "Warranty") item.setWarranty(inputItem.isUrgent());
         });
      });
   };
   context.actions.removeLabelFromId = async (context, arg = { serviceID, label }) => {
      return context.state.processor.acquire("removeLabelFromId", async () => {
         const { serviceID, label } = arg;

         const content = await updateContent(requestRemoveLabel(serviceID, label));
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item) return inputItem;
            item.setLabels(inputItem.labels);
         });
      });
   };
   context.actions.addImageToId = async (context, arg = { serviceID, imageFile }) => {
      return context.state.processor.acquire("addImageToId", async () => {
         const { serviceID, imageFile } = arg;
         const imageFileForm = new FormData();
         imageFileForm.append(imageFile.name, imageFile);
         const api = await requestAddImage(serviceID, imageFileForm);
         if (api.error) throw new Error(api.error);
         const { content } = api;

         const id = content.id;
         const dataImages = content.items;
         return context.state.list.updateItemById(id, (item) => {
            dataImages
               .map((dataImage) => new ServiceImage(Stores).fromData(dataImage))
               .forEach((image) => {
                  const existingImage = item.imageFiles.find((img) => {
                     return img.name === image.name;
                  });
                  if (!existingImage) item.imageFiles.push(image);
               });
         });
      });
   };
   context.actions.removeImageFromId = async (context, arg = { serviceID, image }) => {
      return context.state.processor.acquire("removeImageFromId", async () => {
         const { serviceID, image } = arg;

         await updateContent(requestRemoveImage(serviceID, image));
         return context.state.list.updateItemById(serviceID, (item) => {
            item.imageFiles = item.imageFiles.filter((imageFile) => {
               return imageFile.name !== image.name;
            });
         });
      });
   };

   return new Vuex.Store(context);
};

export default { init };
