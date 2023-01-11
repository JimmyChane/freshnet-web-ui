import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";

import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import ItemCustomerDevice from "../items/CustomerDevice.js";
import List from "./tools/List";
import U from "@/U";

const apiThenContent = (api) => {
   let error = api.getError();
   let friendlyError = api.getErrorFriendly();

   if (error) throw new Error(error);
   if (friendlyError) throw new Error(friendlyError);
   return api.getContent();
};
const getItemOfId = async (context, id = "") => {
   return context.state.processor.acquire("getItemOfId", async () => {
      if (typeof id !== "string") return null;
      const items = await context.dispatch("getItems");
      const item = items.find((item) => item.id === id);
      return item ? item : null;
   });
};
const getItemsOfIds = async (context, ids = []) => {
   return context.state.processor.acquire("getItemsOfIds", async () => {
      if (!U.isArray(ids)) return [];

      const items = await context.dispatch("getItems");
      const results = ids.map((id) => {
         const item = items.find((item) => item.id === id);
         return item ? item : null;
      });
      return results;
   });
};

export default {
   init(Stores) {
      const deviceStore = new Vuex.Store({
         state: {
            dataLoader: new DataLoader({ timeout: 1000 * 60 * 10 }) // 10min
               .processor(() => deviceStore.state.processor)
               .loadData(async () => {
                  let api = await ApiHost.request().url("customer/device/list").send();
                  let content = apiThenContent(api);
                  let contents = Array.isArray(content) ? content : [];
                  let items = contents.map((content) => {
                     return new ItemCustomerDevice(Stores).fromData(content);
                  });
                  return items;
               })
               .setData((data) => {
                  deviceStore.state.list.clear().addItems(...U.optArray(data));
               })
               .getData(() => deviceStore.getters.items),
            processor: new Processor(),
            list: new List(),
         },
         getters: {
            isLoading: (state) => state.processor.isLoading(),
            lastModified: (state) => state.list.lastModified,
            items: (state) => state.list.items,
         },
         actions: {
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
               return getItemOfId(context, id);
            },
            getItemsOfIds: async (context, ids = []) => {
               return getItemsOfIds(context, ids);
            },

            addItem: async (context, arg = {}) => {
               return context.state.processor.acquire("addItem", async () => {
                  let data = new ItemCustomerDevice(Stores).fromData(arg).toData();
                  delete data.id;
                  let api = await ApiHost.request()
                     .POST()
                     .url("customer/device/add")
                     .body({ content: data })
                     .send();
                  let content = apiThenContent(api);

                  const item = context.state.list.addItem(
                     new ItemCustomerDevice(Stores).fromData(content),
                  );
                  const customer = Stores.customer.getters.items.find((customer) => {
                     return customer.id === item.ownerCustomerId;
                  });
                  if (customer) customer.deviceIds.push(item.id);
                  return item;
               });
            },
            removeItemOfId: async (context, arg = {}) => {
               return context.state.processor.acquire("removeItemById", async () => {
                  let api = await ApiHost.request()
                     .DELETE()
                     .url("customer/device/remove")
                     .body({
                        content: {
                           ownerCustomerId: arg.ownerCustomerId,
                           deviceId: arg.id,
                        },
                     })
                     .send();
                  let content = apiThenContent(api);
                  let item = new ItemCustomerDevice(Stores).fromData(content);
                  let customer = Stores.customer.getters.customers.find((customer) => {
                     return customer.id === item.ownerCustomerId;
                  });
                  customer.deviceIds = customer.deviceIds.filter((deviceId) => {
                     return deviceId !== item.id;
                  });

                  return context.state.list.removeItemByItem(item);
               });
            },

            updateSpecificationsOfId: async (context, arg = { _id, specifications }) => {
               return context.state.processor.acquire(
                  "updateSpecificationsOfId",
                  async () => {
                     let { _id, specifications } = arg;
                     let api = await ApiHost.request()
                        .PUT()
                        .url("customer/device/update/specifications")
                        .body({ content: { _id, specifications } })
                        .send();
                     let content = apiThenContent(api);

                     const inputItem = new ItemCustomerDevice(Stores).fromData(content);
                     return context.state.list.updateItemById(inputItem.id, (item) => {
                        item.specifications = inputItem.specifications;
                     });
                  },
               );
            },
            updateDescriptionOfId: async (context, arg = { _id, description }) => {
               return context.state.processor.acquire(
                  "updateDescriptionOfId",
                  async () => {
                     const { _id, description } = arg;
                     const api = await ApiHost.request()
                        .PUT()
                        .url("customer/device/update/description")
                        .body({ content: { _id, description } })
                        .send();
                     const content = apiThenContent(api);
                     const inputItem = new ItemCustomerDevice(Stores).fromData(content);
                     return context.state.list.updateItemById(inputItem.id, (item) => {
                        item.description = inputItem.description;
                     });
                  },
               );
            },
         },
      });

      return deviceStore;
   },
};
