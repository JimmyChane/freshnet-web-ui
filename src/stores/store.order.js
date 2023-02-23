import Vuex from "vuex";
import HostApi from "@/host/HostApi.js";
import Order from "@/items/Order.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

const requestList = async () => {
   return HostApi.request().url("order/").send();
};
const requestAdd = async (body) => {
   return HostApi.request().POST().url("order/").body(body).send();
};
const requestDelete = async (id) => {
   return HostApi.request().DELETE().url("order/").body({ id }).send();
};
const requestUpdateStatus = async (id, status) => {
   return HostApi.request().PUT().url("order/").body({ id, status }).send();
};

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await requestList();
      const error = api.getError();
      if (error) throw new Error(error);
      return U.optArray(api.getContent()).map((data) => {
         return new Order(Stores).fromData(data);
      });
   });
   context.onGetStore(() => Stores.order);
   context.build();
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
   context.actions.getGroupsByStatus = async (context) => {
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
   };

   context.actions.addItem = async (context, arg = { data }) => {
      return context.state.processor.acquire("addItem", async () => {
         const { data } = arg;
         if (!data) return null;
         const api = await requestAdd(data);
         const error = api.getError();
         const content = api.getContent();
         if (error) throw new Error();
         return context.state.list.addItem(new Order().fromData(content));
      });
   };
   context.actions.removeOItemOfId = async (context, arg = { id }) => {
      return context.state.processor.acquire("removeOItemOfId", async () => {
         const { id } = arg;
         const api = await requestDelete(id);
         const error = api.getError();
         if (error) throw new Error();
         context.state.list.removeItemById(id);
      });
   };
   context.actions.updateStatusOfId = async (context, arg = { id, status }) => {
      return context.state.processor.acquire("updateStatusOfId", async () => {
         const { id, status } = arg;
         const api = await requestUpdateStatus(id, status);
         const error = api.getError();
         if (error) throw new Error();
         return context.state.list.updateItemById(id, (item) => {
            item.status = status;
         });
      });
   };
   context.actions.updateToPendingOfId = async (context, id = "") => {
      const status = Order.Status.Pending;
      return context.dispatch("updateStatusOfId", { id, status });
   };
   context.actions.updateToCompletedOfId = async (context, id = "") => {
      const status = Order.Status.Completed;
      return context.dispatch("updateStatusOfId", { id, status });
   };

   return new Vuex.Store(context);
};

export default { init };
