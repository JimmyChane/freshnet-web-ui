import Vuex from "vuex";
import ApiHost from "@/host/ApiHost.js";
import Order from "@/items/Order.js";

import DataLoader from "./tools/DataLoader";
import Processor from "./tools/Processor.js";
import List from "./tools/List";
import U from "@/U";

export default {
   init(Stores) {
      const store = new Vuex.Store({
         state: {
            dataLoader: DataLoader.withStore(() => store).loadData(async () => {
               const api = await ApiHost.request().url("order/").send();
               const error = api.getError();
               if (error) throw new Error(error);
               return U.optArray(api.getContent()).map((data) => {
                  return new Order(Stores).fromData(data);
               });
            }),
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
            getGroupsByStatus: async (context) => {
               const items = await context.dispatch("getItems");
               const groups = items.reduce((groups, item) => {
                  let group = groups.find((group) => group.status === item.status);

                  if (!group) {
                     group = { status: item.status, items: [] };
                     groups.push(group);
                  }

                  group.items.push(item);
                  return groups;
               }, []);

               return groups;
            },

            addItem: async (context, arg = { data }) => {
               return context.state.processor.acquire("addItem", async () => {
                  let { data } = arg;
                  if (!data) return null;
                  let api = await ApiHost.request()
                     .POST()
                     .url("order/")
                     .body(data)
                     .send();
                  let error = api.getError();
                  let content = api.getContent();
                  if (error) throw new Error();

                  return context.state.list.addItem(new Order().fromData(content));
               });
            },
            removeOItemOfId: async (context, arg = { id }) => {
               return context.state.processor.acquire("removeOItemOfId", async () => {
                  let { id } = arg;
                  let api = await ApiHost.request()
                     .DELETE()
                     .url("order/")
                     .body({ id })
                     .send();
                  let error = api.getError();
                  if (error) throw new Error();

                  context.state.list.removeItemById(id);
               });
            },
            updateStatusOfId: async (context, arg = { id, status }) => {
               return context.state.processor.acquire("updateStatusOfId", async () => {
                  let { id, status } = arg;
                  let api = await ApiHost.request()
                     .PUT()
                     .url("order/")
                     .body({ id, status })
                     .send();
                  let error = api.getError();
                  if (error) throw new Error();

                  return context.state.list.updateItemById(id, (item) => {
                     item.status = status;
                  });
               });
            },
            updateToPendingOfId: async (context, id = "") => {
               const status = Order.STATUS.PENDING;
               return context.dispatch("updateStatusOfId", { id, status });
            },
            updateToCompletedOfId: async (context, id = "") => {
               const status = Order.STATUS.COMPLETED;
               return context.dispatch("updateStatusOfId", { id, status });
            },
         },
      });

      return store;
   },
};
