import DataLoader from "./tools/DataLoader";
import CollectionUpdater from "./tools/CollectionUpdaterService";
import Processor from "./tools/Processor.js";

import Service from "@/items/Service.js";
import ServiceImage from "@/items/ServiceImage";

import Vuex from "vuex";
import ServiceModule from "@/items/data/Service.js";
import ApiHost from "@/host/ApiHost.js";
import List from "./tools/List";

export default {
   init(Stores) {
      const storeService = new Vuex.Store({
         state: {
            list: new List(),

            lastModified: 0,
            dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
               .processor(() => storeService.state.processor)
               .loadData(async () => {
                  const api = await ApiHost.request().url("service_v2/get/items").send();
                  const error = api.getError();
                  const content = api.getContent();
                  if (error) throw new Error(error);
                  const contents = Array.isArray(content) ? content : [];
                  const items = contents.map((content) => {
                     return new Service(Stores).fromData(content);
                  });
                  return items;
               })
               .setData((data) => {
                  storeService.commit("items", Array.isArray(data) ? data : []);
                  storeService.commit("lastModified", Date.now());
               })
               .getData(() => storeService.getters.items),
            processor: new Processor(),
         },
         mutations: {
            lastModified: (state, time) => (state.lastModified = time),
            items: (state, items) => state.list.replaceItems(...items),
         },
         getters: {
            lastModified: (state) => state.lastModified,
            isLoading: (state) => state.processor.isLoading(),
            items(state) {
               return state.list.items
                  .map((service) => {
                     if (Array.isArray(service.events))
                        service.events.sort((event1, event2) => event1.compare(event2));
                     return service;
                  })
                  .sort((service1, service2) => service1.compare(service2));
            },
         },
         actions: {
            socketNotify: (context, data) => {
               const { key, content } = data;

               if (key === "item-add")
                  new CollectionUpdater(context)
                     .toAdd()
                     .withItem(new Service(Stores).fromData(content))
                     .commitThenGetItem();
               if (key === "item-remove")
                  new CollectionUpdater(context)
                     .toRemove()
                     .withItem(new Service(Stores).fromData(content))
                     .commitThenGetItem();
               if (key === "item-image-add") return;
               if (key === "item-image-remove") return;
               if (key === "item-event-add") return;
               if (key === "item-event-remove") return;
               if (key === "item-label-add") return;
               if (key === "item-label-remove") return;
               if (key === "item-state-update") return;
               if (key === "item-description-update") return;
               if (key === "item-belongings-update") return;
               if (key === "item-customer-update") return;
            },

            async refresh(context) {
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
                  return new CollectionUpdater(context)
                     .toAdd()
                     .withItem(new Service(Stores).fromData(content))
                     .commitThenGetItem();
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
                  return new CollectionUpdater(context)
                     .toAdd()
                     .withItem(new Service(Stores).fromData(content))
                     .commitThenGetItem();
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
                  new CollectionUpdater(context)
                     .toRemove()
                     .withId(id)
                     .commitThenGetItem();
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withId(serviceID)
                     .updateThenCommitThenGetItem((oldItem) => {
                        oldItem.state = state;
                     });
               });
            },
            updateDescriptionOfId: async (context, arg = { serviceID, description }) => {
               return context.state.processor.acquire(
                  "updateDescriptionOfId",
                  async () => {
                     let { serviceID, description } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url(`service_v2/item/${serviceID}/update/description/`)
                        .body({ content: description })
                        .send();
                     let error = api.getError();
                     if (error) throw new Error();

                     return new CollectionUpdater(context)
                        .toUpdate()
                        .withId(serviceID)
                        .updateThenCommitThenGetItem((oldItem) => {
                           oldItem.description = description;
                        });
                  },
               );
            },
            updateBelongingsOfId: async (context, arg = { serviceID, belongings }) => {
               return context.state.processor.acquire(
                  "updateBelongingsOfId",
                  async () => {
                     let { serviceID, belongings } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url(`service_v2/item/${serviceID}/update/belonging/`)
                        .body({ content: belongings })
                        .send();
                     let error = api.getError();
                     let content = api.getContent();
                     if (error) throw new Error();

                     return new CollectionUpdater(context)
                        .toUpdate()
                        .withItem(new Service(Stores).fromData(content))
                        .updateThenCommitThenGetItem((oldItem, newItem) => {
                           oldItem.belongings = newItem.belongings;
                        });
                  },
               );
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withItem(new Service(Stores).fromData(content))
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        oldItem.customer = newItem.customer;
                     });
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withItem(new Service(Stores).fromData(content))
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        const events = newItem.events.sort((event1, event2) => {
                           return event1.compare(event2);
                        });
                        oldItem.events = events;
                     });
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withId(serviceID)
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        oldItem.events = oldItem.events.filter((event) => {
                           return event.timestamp.time !== time;
                        });
                     });
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withItem(new Service(Stores).fromData(content))
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        oldItem.setUrgent(newItem.isUrgent());
                     });
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withItem(new Service(Stores).fromData(content))
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        oldItem.setWarranty(newItem.isWarranty());
                     });
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withItem(new Service(Stores).fromData(content))
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        oldItem.setLabels(newItem.labels);
                     });
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
                  const { items, fail_count } = content;

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withId(serviceID)
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        const images = items.map((image) => {
                           return new ServiceImage().fromData(image);
                        });
                        oldItem.imageFiles.push(...images);
                     });
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

                  return new CollectionUpdater(context)
                     .toUpdate()
                     .withId(serviceID)
                     .updateThenCommitThenGetItem((oldItem, newItem) => {
                        oldItem.imageFiles = oldItem.imageFiles.filter((imageFile) => {
                           return imageFile.name !== image.name;
                        });
                     });
               });
            },
         },
      });

      return storeService;
   },
};
