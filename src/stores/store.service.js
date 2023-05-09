import Service from "@/items/Service.js";
import ServiceImage from "@/items/ServiceImage";
import Vuex from "vuex";
import ServiceModule from "@/items/data/Service.js";
import ServiceCustomer from "@/items/ServiceCustomer";
import ServiceEvent from "@/items/ServiceEvent";
import StoreBuilder from "./tools/StoreBuilder";
import ServiceLabel from "@/items/data/ServiceLabel";
import ServiceRequest from "@/request/Service";

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

const init = (Stores) => {
   const context = new StoreBuilder()
      .onFetchItems(async () => {
         return (await ServiceRequest.list())
            .optArrayContent()
            .map((content) => {
               return new Service(Stores).fromData(content);
            });
      })
      .onGetStore(() => Stores.service)

      .action("refresh", async (context) => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      })
      .action("getItems", async (context) => {
         return context.state.dataLoader.data();
      })
      .action("getItemOfId", async (context, id = "") => {
         let items = await context.dispatch("getItems");
         return items.find((service) => service.id === id);
      })
      .action("getGroupsByCustomer", async (context) => {
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
      })
      .action("importItem", async (context, arg = { data }) => {
         const { data } = arg;
         if (!data) throw new Error();
         const service = ServiceModule.trim(data);
         const content = (
            await ServiceRequest.import(service)
         ).optObjectContent();
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.addItem(inputItem);
      })
      .action("addItem", async (context, arg = { data }) => {
         const { data } = arg;
         if (!data) return null;
         if (!data) throw new Error("invalid data");

         const content = (await ServiceRequest.add(data)).optObjectContent();
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.addItem(inputItem);
      })
      .action("removeItemOfId", async (context, arg = { id }) => {
         const { id } = arg;
         (await ServiceRequest.remove(id)).getContent();
         return context.state.list.removeItemById(id);
      })
      .action(
         "updateStateOfId",
         async (context, arg = { serviceID, state }) => {
            const { serviceID, state } = arg;

            (await ServiceRequest.updateState(serviceID, state)).getContent();
            return context.state.list.updateItemById(serviceID, (item) => {
               item.state = state;
            });
         },
      )
      .action(
         "updateDescriptionOfId",
         async (context, arg = { serviceID, description }) => {
            const { serviceID, description } = arg;

            (
               await ServiceRequest.updateDescription(serviceID, description)
            ).getContent();
            return context.state.list.updateItemById(serviceID, (item) => {
               item.description = description;
            });
         },
      )
      .action(
         "updateBelongingsOfId",
         async (context, arg = { serviceID, belongings }) => {
            const { serviceID, belongings } = arg;
            const content = (
               await ServiceRequest.updateBelongings(serviceID, belongings)
            ).optObjectContent();
            const inputItem = new Service(Stores).fromData(content);
            return context.state.list.updateItemById(inputItem.id, (item) => {
               if (!item) return inputItem;
               item.belongings = inputItem.belongings;
            });
         },
      )
      .action(
         "updateCustomerOfId",
         async (context, arg = { serviceID, customer }) => {
            const { serviceID, customer } = arg;
            const content = (
               await ServiceRequest.updateCustomer(serviceID, customer)
            ).optObjectContent();
            const inputItem = new Service(Stores).fromData(content);
            return context.state.list.updateItemById(inputItem.id, (item) => {
               if (!item) return inputItem;
               item.customer = inputItem.customer;
            });
         },
      )
      .action(
         "addEventToId",
         async (context, arg = { serviceID: "", data: null }) => {
            const { serviceID: id, data: eventData } = arg;
            if (!id || !eventData) return null;

            const api = await ServiceRequest.addEvent(id, eventData);
            const content = api.optObjectContent();
            const inputItem = new Service(Stores).fromData(content);
            return context.state.list.updateItemById(inputItem.id, (item) => {
               if (!item) return inputItem;
               item.events = inputItem.events.sort((event1, event2) => {
                  return event1.compare(event2);
               });
            });
         },
      )
      .action(
         "removeEventFromId",
         async (context, arg = { serviceID, time }) => {
            const { serviceID, time } = arg;

            (await ServiceRequest.removeEvent(serviceID, time)).getContent();
            return context.state.list.updateItemById(serviceID, (item) => {
               item.events = item.events.filter((event) => {
                  return event.timestamp.time !== time;
               });
            });
         },
      )
      .action(
         "updateUrgentOfId",
         async (context, arg = { serviceID, isUrgent }) => {
            const label = ServiceLabel.Defaults.Urgent;
            if (arg.isUrgent) {
               return context.dispatch("addLabelToId", {
                  serviceID: arg.serviceID,
                  label,
               });
            } else {
               return context.dispatch("removeLabelFromId", {
                  serviceID: arg.serviceID,
                  label,
               });
            }
         },
      )
      .action(
         "updateWarrantyOfId",
         async (context, arg = { serviceID, isWarranty }) => {
            const label = ServiceLabel.Defaults.Warranty;
            if (arg.isWarranty) {
               return context.dispatch("addLabelToId", {
                  serviceID: arg.serviceID,
                  label,
               });
            } else {
               return context.dispatch("removeLabelFromId", {
                  serviceID: arg.serviceID,
                  label,
               });
            }
         },
      )
      .action("addLabelToId", async (context, arg = { serviceID, label }) => {
         const { serviceID, label } = arg;
         const content = (
            await ServiceRequest.addLabel(serviceID, label)
         ).optObjectContent();
         const inputItem = new Service(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            if (label.title === "Urgent") item.setUrgent(inputItem.isUrgent());
            if (label.title === "Warranty")
               item.setWarranty(inputItem.isUrgent());
         });
      })
      .action(
         "removeLabelFromId",
         async (context, arg = { serviceID, label }) => {
            const { serviceID, label } = arg;

            const content = (
               await ServiceRequest.removeLabel(serviceID, label)
            ).optObjectContent();
            const inputItem = new Service(Stores).fromData(content);
            return context.state.list.updateItemById(inputItem.id, (item) => {
               if (!item) return inputItem;
               item.setLabels(inputItem.labels);
            });
         },
      )
      .action("addImageTemp", async (context, imageFiles = []) => {
         const formData = new FormData();
         for (const imageFile of imageFiles) {
            formData.append(imageFile.name, imageFile);
         }

         const api = await ServiceRequest.addImageTemp(formData);
         return api.optArrayContent();
      })
      .action(
         "addImageToId",
         async (context, arg = { serviceID, imageFile }) => {
            const { serviceID, imageFile } = arg;

            const imageFileForm = new FormData();
            imageFileForm.append(imageFile.name, imageFile);

            const api = await ServiceRequest.addImage(serviceID, imageFileForm);
            const content = api.optObjectContent();
            const id = content.id;
            const dataImages = content.items;
            return context.state.list.updateItemById(id, (item) => {
               dataImages
                  .map((dataImage) =>
                     new ServiceImage(Stores).fromData(dataImage),
                  )
                  .forEach((image) => {
                     const existingImage = item.imageFiles.find((img) => {
                        return img.name === image.name;
                     });
                     if (!existingImage) item.imageFiles.push(image);
                  });
            });
         },
      )
      .action(
         "removeImageFromId",
         async (context, arg = { serviceID, image }) => {
            const { serviceID, image } = arg;

            (await ServiceRequest.removeImage(serviceID, image)).getContent();
            return context.state.list.updateItemById(serviceID, (item) => {
               item.imageFiles = item.imageFiles.filter((imageFile) => {
                  return imageFile.name !== image.name;
               });
            });
         },
      )
      .action(
         "removeImageFromId",
         async (context, arg = { serviceID, image }) => {
            const { serviceID, image } = arg;

            (await ServiceRequest.removeImage(serviceID, image)).getContent();
            return context.state.list.updateItemById(serviceID, (item) => {
               item.imageFiles = item.imageFiles.filter((imageFile) => {
                  return imageFile.name !== image.name;
               });
            });
         },
      )
      .build();

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

   return new Vuex.Store(context);
};

export default { init };
