import Service from "@/items/Service.js";
import ServiceImage from "@/items/ServiceImage";
import Vuex from "vuex";
import ServiceCustomer from "@/items/ServiceCustomer";
import ServiceEvent from "@/items/ServiceEvent";
import StoreBuilder from "./tools/StoreBuilder";
import ServiceLabel from "@/items/ServiceLabel";
import ServiceRequest from "@/request/Service";
import ServiceBelonging from "@/items/ServiceBelonging";
const Notify = {
    ItemAdd: "item-add",
    ItemRemove: "item-remove",
    ItemImageAdd: "item-image-add",
    ItemImageRemove: "item-image-remove",
    ItemEventAdd: "item-event-add",
    ItemEventRemove: "item-event-remove",
    ItemEventDescriptionUpdate: "item-event-description-update",
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
        const api = await ServiceRequest.list();
        const content = api.optArrayContent();
        return content.map((content) => new Service(Stores).fromData(content));
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
                if (group.customer && item.customer) {
                    return group.customer.isEqual(item.customer);
                }
                return group.customer === item.customer;
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
        .action("importItem", async (context, arg) => {
        const { data } = arg;
        if (!data)
            throw new Error();
        const service = new Service(Stores).fromData(data).toData();
        const content = (await ServiceRequest.import(service)).optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.addItem(inputItem);
    })
        .action("addItem", async (context, arg) => {
        const { data } = arg;
        if (!data)
            return null;
        if (!data)
            throw new Error("invalid data");
        const content = (await ServiceRequest.add(data)).optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.addItem(inputItem);
    })
        .action("removeItemOfId", async (context, arg) => {
        const { id } = arg;
        (await ServiceRequest.remove(id)).getContent();
        return context.state.list.removeItemById(id);
    })
        .action("updateStateOfId", async (context, arg) => {
        const { serviceID, state } = arg;
        (await ServiceRequest.updateState(serviceID, state)).getContent();
        return context.state.list.updateItemById(serviceID, (item) => {
            if (!item)
                return;
            item.state = state;
        });
    })
        .action("updateDescriptionOfId", async (context, arg) => {
        const { serviceID, description } = arg;
        const api = await ServiceRequest.updateDescription(serviceID, description);
        api.getContent();
        return context.state.list.updateItemById(serviceID, (item) => {
            if (!item)
                return;
            item.description = description;
        });
    })
        .action("updateBelongingsOfId", async (context, arg) => {
        const { serviceID, belongings } = arg;
        const api = await ServiceRequest.updateBelongings(serviceID, belongings);
        const content = api.optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item)
                return inputItem;
            item.belongings = inputItem.belongings;
        });
    })
        .action("updateCustomerOfId", async (context, arg) => {
        const { serviceID, customer } = arg;
        const api = await ServiceRequest.updateCustomer(serviceID, customer);
        const content = api.optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item)
                return inputItem;
            item.customer = inputItem.customer;
        });
    })
        .action("addEventToId", async (context, arg = { serviceID: "", data: null }) => {
        const { serviceID: id, data: eventData } = arg;
        if (!id || !eventData)
            return null;
        const api = await ServiceRequest.addEvent(id, eventData);
        const content = api.optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item)
                return inputItem;
            item.events = inputItem.events.sort((event1, event2) => {
                return event2.compare(event1);
            });
        });
    })
        .action("removeEventFromId", async (context, arg) => {
        const { serviceID, time } = arg;
        const api = await ServiceRequest.removeEvent(serviceID, time);
        api.getContent();
        return context.state.list.updateItemById(serviceID, (item) => {
            if (!item)
                return;
            item.events = item.events.filter((event) => {
                return event.timestamp?.time !== time;
            });
        });
    })
        .action("updateEventDescription", async (context, arg = {}) => {
        const { serviceID, time, description } = arg;
        const api = await ServiceRequest.updateEventDescription(serviceID, time, description);
        const content = api.getContent();
        const { id: outputId, event } = content;
        const outputEvent = new ServiceEvent(Stores).fromData(event);
        return context.state.list.updateItemById(outputId, (item) => {
            if (!item)
                return;
            const foundEvent = item.events.find((event) => {
                return event.timestamp?.time === outputEvent.timestamp?.time;
            });
            if (foundEvent) {
                foundEvent.description = outputEvent.description;
            }
        });
    })
        .action("updateUrgentOfId", async (context, arg) => {
        const label = ServiceLabel.URGENT.toData();
        if (arg.isUrgent) {
            return context.dispatch("addLabelToId", {
                serviceID: arg.serviceID,
                label,
            });
        }
        else {
            return context.dispatch("removeLabelFromId", {
                serviceID: arg.serviceID,
                label,
            });
        }
    })
        .action("updateWarrantyOfId", async (context, arg) => {
        const label = ServiceLabel.WARRANTY.toData();
        if (arg.isWarranty) {
            return context.dispatch("addLabelToId", {
                serviceID: arg.serviceID,
                label,
            });
        }
        else {
            return context.dispatch("removeLabelFromId", {
                serviceID: arg.serviceID,
                label,
            });
        }
    })
        .action("addLabelToId", async (context, arg) => {
        const { serviceID, label } = arg;
        const api = await ServiceRequest.addLabel(serviceID, label);
        const content = api.optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item)
                return;
            if (label.title === "Urgent")
                item.setUrgent(inputItem.isUrgent());
            if (label.title === "Warranty")
                item.setWarranty(inputItem.isUrgent());
        });
    })
        .action("removeLabelFromId", async (context, arg) => {
        const { serviceID, label } = arg;
        const api = await ServiceRequest.removeLabel(serviceID, label);
        const content = api.optObjectContent();
        const inputItem = new Service(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
            if (!item)
                return inputItem;
            item.setLabels(inputItem.labels);
        });
    })
        .action("addImageTemp", async (context, imageFiles = []) => {
        const formData = new FormData();
        for (const imageFile of imageFiles) {
            formData.append(imageFile.name, imageFile);
        }
        const api = await ServiceRequest.addImageTemp(formData);
        return api.optArrayContent();
    })
        .action("addImageToId", async (context, arg) => {
        const { serviceID, imageFiles } = arg;
        const formData = new FormData();
        for (const imageFile of imageFiles) {
            formData.append(imageFile.name, imageFile);
        }
        const api = await ServiceRequest.addImage(serviceID, formData);
        const content = api.optObjectContent();
        const id = content.id;
        const dataImages = content.items;
        return context.state.list.updateItemById(id, (item) => {
            if (!item)
                return;
            dataImages
                .map((dataImage) => new ServiceImage(Stores).fromData(dataImage))
                .forEach((image) => {
                const existingImage = item.imageFiles.find((img) => {
                    return img.name === image.name;
                });
                if (!existingImage)
                    item.imageFiles.push(image);
            });
        });
    })
        .action("removeImageFromId", async (context, arg) => {
        const { serviceID, image } = arg;
        const api = await ServiceRequest.removeImage(serviceID, image);
        api.getContent();
        return context.state.list.updateItemById(serviceID, (item) => {
            if (!item)
                return;
            item.imageFiles = item.imageFiles.filter((imageFile) => {
                return imageFile.name !== image.name;
            });
        });
    })
        .action("removeImageFromId", async (context, arg) => {
        const { serviceID, image } = arg;
        (await ServiceRequest.removeImage(serviceID, image)).getContent();
        return context.state.list.updateItemById(serviceID, (item) => {
            if (!item)
                return;
            item.imageFiles = item.imageFiles.filter((imageFile) => {
                return imageFile.name !== image.name;
            });
        });
    })
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
                    if (!existingImage)
                        item.imageFiles.push(image);
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
                const inputEvent = new ServiceEvent(Stores).fromData(event);
                const found = item.events.find((itemEvent) => {
                    if (itemEvent.timestamp && inputEvent.timestamp) {
                        return itemEvent.timestamp.time === inputEvent.timestamp.time;
                    }
                    return itemEvent.timestamp === inputEvent.timestamp;
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
                if (!item)
                    return;
                const inputEvent = new ServiceEvent(Stores).fromData(event);
                const found = item.events.find((itemEvent) => {
                    if (itemEvent.timestamp && inputEvent.timestamp) {
                        return itemEvent.timestamp.time === inputEvent.timestamp.time;
                    }
                    return itemEvent.timestamp === inputEvent.timestamp;
                });
                if (found)
                    item.events.splice(item.events.indexOf(found), 1);
            });
        }
        if (key === Notify.ItemEventDescriptionUpdate) {
        }
        if (key === Notify.ItemLabelAdd) {
            const { id, label } = content;
            context.state.list.updateItemById(id, (item) => {
                if (!item)
                    return;
                if (label.title === "Urgent")
                    item.setUrgent(true);
                if (label.title === "Warranty")
                    item.setWarranty(true);
            });
        }
        if (key === Notify.ItemLabelRemove) {
            const { id, label } = content;
            context.state.list.updateItemById(id, (item) => {
                if (!item)
                    return;
                if (label.title === "Urgent")
                    item.setUrgent(false);
                if (label.title === "Warranty")
                    item.setWarranty(false);
            });
        }
        if (key === Notify.ItemStateUpdate) {
            const { id, state } = content;
            context.state.list.updateItemById(id, (item) => {
                if (item)
                    item.state = state;
            });
        }
        if (key === Notify.ItemDescriptionUpdate) {
            const { id, description } = content;
            context.state.list.updateItemById(id, (item) => {
                if (item)
                    item.description = description;
            });
        }
        if (key === Notify.ItemBelongingsUpdate) {
            const { id, belongings: dataBelongings } = content;
            const belongings = dataBelongings.map((belonging) => {
                return new ServiceBelonging(Stores).fromData(belonging);
            });
            context.state.list.updateItemById(id, (item) => {
                if (item)
                    item.belongings = belongings;
            });
        }
        if (key === Notify.ItemCustomerUpdate) {
            const { id, customer } = content;
            context.state.list.updateItemById(id, (item) => {
                if (item)
                    item.customer = new ServiceCustomer(Stores).fromData(customer);
            });
        }
    };
    return new Vuex.Store(context);
};
export default { init };
