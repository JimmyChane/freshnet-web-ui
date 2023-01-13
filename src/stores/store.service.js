import Service from "@/items/Service.js";
import ServiceImage from "@/items/ServiceImage";
import Vuex from "vuex";
import ServiceModule from "@/items/data/Service.js";
import ApiHost from "@/host/ApiHost.js";
import ServiceCustomer from "@/items/ServiceCustomer";
import ServiceEvent from "@/items/ServiceEvent";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

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

export default {
   init(Stores) {
      const context = new StoreBuilder().onFetchItems(async () => {
         const api = await ApiHost.request().url("service_v2/get/items").send();
         const error = api.getError();
         if (error) throw new Error(error);
         return U.optArray(api.getContent()).map((content) => {
            return new Service(Stores).fromData(content);
         });
      });
      context.onGetStore(() => Stores.service);
      context.build();
      context.actions = {
         socketNotify: (context, data) => {
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
                     .map((dataImage) => new ServiceImage().fromData(dataImage))
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
         },

         refresh: async (context) => {
            return context.state.processor.acquire("refresh", async () => {
               context.state.dataLoader.doTimeout();
               await context.dispatch("getItems");
            });
         },

         getItems: async (context) => {
            return context.state.processor.acquire("getItems", async () => {
               return context.state.dataLoader.data();
            });
         },
         getItemOfId: async (context, id = "") => {
            return context.state.processor.acquire("getItemOfId", async () => {
               let items = await context.dispatch("getServices");
               return items.find((service) => service.id === id);
            });
         },

         getGroupsByCustomer: async (context) => {
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
         },

         importItem: async (context, arg = { data }) => {
            return context.state.processor.acquire("importItem", async () => {
               let { data } = arg;
               if (!data) throw new Error();
               let service = ServiceModule.trim(data);
               let api = await ApiHost.request()
                  .POST()
                  .url("service_v2/import/item/")
                  .body({ content: service })
                  .send();
               let error = api.getError();
               let content = api.getContent();
               if (error) throw new Error();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.addItem(inputItem);
               return outputItem;
            });
         },

         addItem: async (context, arg = { data }) => {
            return context.state.processor.acquire("addItem", async () => {
               let { data } = arg;
               if (!data) return null;
               if (!data) throw new Error("invalid data");
               let api = await ApiHost.request()
                  .POST()
                  .url("service_v2/add/item/")
                  .body({ content: data })
                  .send();
               let error = api.getError();
               let content = api.getContent();
               if (error) throw new Error();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.addItem(inputItem);
               return outputItem;
            });
         },
         removeItemOfId: async (context, arg = { id }) => {
            return context.state.processor.acquire("removeItemOfId", async () => {
               let { id } = arg;
               let api = await ApiHost.request()
                  .DELETE()
                  .url(`service_v2/delete/item/${id}`)
                  .send();
               let error = api.getError();
               if (error) throw new Error();
               const outputItem = context.state.list.removeItemById(id);
               return outputItem;
            });
         },
         updateStateOfId: async (context, arg = { serviceID, state }) => {
            return context.state.processor.acquire("updateStateOfId", async () => {
               let { serviceID, state } = arg;
               let api = await ApiHost.request()
                  .PUT()
                  .url(`service_v2/item/${serviceID}/update/state/`)
                  .body({ content: state })
                  .send();
               let error = api.getError();
               if (error) throw new Error();

               const outputItem = context.state.list.updateItemById(serviceID, (item) => {
                  item.state = state;
               });
               return outputItem;
            });
         },
         updateDescriptionOfId: async (context, arg = { serviceID, description }) => {
            return context.state.processor.acquire("updateDescriptionOfId", async () => {
               let { serviceID, description } = arg;
               let api = await ApiHost.request()
                  .PUT()
                  .url(`service_v2/item/${serviceID}/update/description/`)
                  .body({ content: description })
                  .send();
               let error = api.getError();
               if (error) throw new Error();

               const outputItem = context.state.list.updateItemById(serviceID, (item) => {
                  item.description = description;
               });
               return outputItem;
            });
         },
         updateBelongingsOfId: async (context, arg = { serviceID, belongings }) => {
            return context.state.processor.acquire("updateBelongingsOfId", async () => {
               let { serviceID, belongings } = arg;
               let api = await ApiHost.request()
                  .PUT()
                  .url(`service_v2/item/${serviceID}/update/belonging/`)
                  .body({ content: belongings })
                  .send();
               let error = api.getError();
               let content = api.getContent();
               if (error) throw new Error();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.updateItemById(
                  inputItem.id,
                  (item) => {
                     if (!item) return inputItem;
                     item.belongings = inputItem.belongings;
                  },
               );
               return outputItem;
            });
         },
         updateCustomerOfId: async (context, arg = { serviceID, customer }) => {
            return context.state.processor.acquire("updateCustomerOfId", async () => {
               let { serviceID, customer } = arg;
               let api = await ApiHost.request()
                  .PUT()
                  .url(`service_v2/item/${serviceID}/update/customer/`)
                  .body({ content: customer })
                  .send();
               let error = api.getError();
               let content = api.getContent();
               if (error) throw new Error();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.updateItemById(
                  inputItem.id,
                  (item) => {
                     if (!item) return inputItem;
                     item.customer = inputItem.customer;
                  },
               );
               return outputItem;
            });
         },

         addEventToId: async (context, arg = { serviceID, data }) => {
            return context.state.processor.acquire("addEventToId", async () => {
               let { serviceID, data } = arg;
               if (!serviceID || !data) return null;
               let api = await ApiHost.request()
                  .POST()
                  .url(`service_v2/item/${serviceID}/add/event/`)
                  .body({ content: data })
                  .send();
               let error = api.getError();
               let content = api.getContent();
               if (error) throw new Error();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.updateItemById(
                  inputItem.id,
                  (item) => {
                     if (!item) return inputItem;
                     item.events = inputItem.events.sort((event1, event2) => {
                        return event1.compare(event2);
                     });
                  },
               );
               return outputItem;
            });
         },
         removeEventFromId: async (context, arg = { serviceID, time }) => {
            return context.state.processor.acquire("removeEventFromId", async () => {
               let { serviceID, time } = arg;
               let api = await ApiHost.request()
                  .DELETE()
                  .url(`service_v2/item/${serviceID}/delete/event/`)
                  .body({ serviceID, time })
                  .send();
               let error = api.getError();
               if (error) throw new Error();

               const outputItem = context.state.list.updateItemById(serviceID, (item) => {
                  item.events = item.events.filter((event) => {
                     return event.timestamp.time !== time;
                  });
               });
               return outputItem;
            });
         },

         updateUrgentOfId: async (context, arg = { serviceID, isUrgent }) => {
            console.warn("updateUrgentOfId is deprecated, please use addLabelToId");
            return context.state.processor.acquire("updateUrgentOfId", async () => {
               let { serviceID, isUrgent } = arg;
               const api = await ApiHost.request()
                  .PUT()
                  .url("service/urgent")
                  .body({ serviceID, isUrgent })
                  .send();

               let error = api.getError();
               if (error) throw new Error();
               const content = api.getContent();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.updateItemById(
                  inputItem.id,
                  (item) => {
                     if (!item) return inputItem;
                     item.setUrgent(inputItem.isUrgent());
                  },
               );
               return outputItem;
            });
         },
         updateWarrantyOfId: async (context, arg = { serviceID, isWarranty }) => {
            console.warn("updateWarrantyOfId is deprecated, please use addLabelToId");
            return context.state.processor.acquire("updateWarrantyOfId", async () => {
               let { serviceID, isWarranty } = arg;
               const api = await ApiHost.request()
                  .PUT()
                  .url("service/warranty")
                  .body({ serviceID, isWarranty })
                  .send();

               let error = api.getError();
               if (error) throw new Error();
               const content = api.getContent();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.updateItemById(
                  inputItem.id,
                  (item) => {
                     if (!item) return inputItem;
                     item.setWarranty(inputItem.isWarranty());
                  },
               );
               return outputItem;
            });
         },

         addLabelToId: async (context, arg = { serviceID, label }) => {
            return context.state.processor.acquire("addLabelToId", async () => {
               let { serviceID, label } = arg;
               const api = await ApiHost.request()
                  .POST()
                  .url(`service_v2/item/${serviceID}/add/label/`)
                  .body({ label })
                  .send();

               let error = api.getError();
               if (error) throw new Error(error);
               const content = api.getContent();
               console.warn(content);
            });
         },
         removeLabelFromId: async (context, arg = { serviceID, label }) => {
            return context.state.processor.acquire("removeLabelFromId", async () => {
               let { serviceID, label } = arg;
               const api = await ApiHost.request()
                  .DELETE()
                  .url(`service_v2/item/${serviceID}/delete/label/`)
                  .body({ label: label.toData() })
                  .send();

               let error = api.getError();
               if (error) throw new Error(error);
               const content = api.getContent();

               const inputItem = new Service(Stores).fromData(content);
               const outputItem = context.state.list.updateItemById(
                  inputItem.id,
                  (item) => {
                     if (!item) return inputItem;
                     item.setLabels(inputItem.labels);
                  },
               );
               return outputItem;
            });
         },

         addImageToId: async (context, arg = { serviceID, imageFile }) => {
            return context.state.processor.acquire("addImageToId", async () => {
               const { serviceID, imageFile } = arg;
               const imageFileForm = new FormData();
               imageFileForm.append(imageFile.name, imageFile);
               const api = await ApiHost.request()
                  .POST()
                  .url(`service_v2/item/${serviceID}/add/image_files/`)
                  .bodyObject(imageFileForm)
                  .sendNotJson();
               if (api.error) throw new Error(api.error);
               const { content } = api;

               const id = content.id;
               const dataImages = content.items;
               const outputItem = context.state.list.updateItemById(id, (item) => {
                  dataImages
                     .map((dataImage) => new ServiceImage().fromData(dataImage))
                     .forEach((image) => {
                        const existingImage = item.imageFiles.find((img) => {
                           return img.name === image.name;
                        });
                        if (!existingImage) item.imageFiles.push(image);
                     });
               });
               return outputItem;
            });
         },
         removeImageFromId: async (context, arg = { serviceID, image }) => {
            return context.state.processor.acquire("removeImageFromId", async () => {
               let { serviceID, image } = arg;
               let api = ApiHost.request()
                  .DELETE()
                  .url(`service_v2/item/${serviceID}/delete/image/`)
                  .body({ content: image.toData() })
                  .send();
               let error = api.error;
               if (error) throw new Error();

               const outputItem = context.state.list.updateItemById(serviceID, (item) => {
                  item.imageFiles = item.imageFiles.filter((imageFile) => {
                     return imageFile.name !== image.name;
                  });
               });
               return outputItem;
            });
         },
      };

      return new Vuex.Store(context);
   },
};
