import Vuex from "vuex";
import ItemCustomerDevice from "../items/CustomerDevice.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import DeviceRequest from "@/request/Device";

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

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await DeviceRequest.list();
      const content = apiThenContent(api);
      return U.optArray(content).map((content) => {
         return new ItemCustomerDevice(Stores).fromData(content);
      });
   });
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
   context.actions.getItemOfId = async (context, id = "") => {
      return getItemOfId(context, id);
   };
   context.actions.getItemsOfIds = async (context, ids = []) => {
      return getItemsOfIds(context, ids);
   };
   context.actions.addItem = async (context, arg = {}) => {
      return context.state.processor.acquire("addItem", async () => {
         const data = new ItemCustomerDevice(Stores).fromData(arg).toData();
         delete data.id;
         const api = await DeviceRequest.add({ content: data });
         const content = apiThenContent(api);

         const item = context.state.list.addItem(
            new ItemCustomerDevice(Stores).fromData(content),
         );
         const customer = Stores.customer.getters.items.find((customer) => {
            return customer.id === item.ownerCustomerId;
         });
         if (customer) customer.deviceIds.push(item.id);
         return item;
      });
   };
   context.actions.removeItemOfId = async (context, arg = {}) => {
      return context.state.processor.acquire("removeItemById", async () => {
         const api = await DeviceRequest.remove({
            content: {
               ownerCustomerId: arg.ownerCustomerId,
               deviceId: arg.id,
            },
         });
         const content = apiThenContent(api);
         const item = new ItemCustomerDevice(Stores).fromData(content);
         const customer = Stores.customer.getters.customers.find((customer) => {
            return customer.id === item.ownerCustomerId;
         });
         customer.deviceIds = customer.deviceIds.filter((deviceId) => {
            return deviceId !== item.id;
         });

         return context.state.list.removeItemByItem(item);
      });
   };
   context.actions.updateSpecificationsOfId = async (
      context,
      arg = { _id, specifications },
   ) => {
      return context.state.processor.acquire("updateSpecificationsOfId", async () => {
         const { _id, specifications } = arg;
         const api = await DeviceRequest.updateSpecification({
            content: { _id, specifications },
         });
         const content = apiThenContent(api);

         const inputItem = new ItemCustomerDevice(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            item.specifications = inputItem.specifications;
         });
      });
   };
   context.actions.updateDescriptionOfId = async (
      context,
      arg = { _id, description },
   ) => {
      return context.state.processor.acquire("updateDescriptionOfId", async () => {
         const { _id, description } = arg;
         const api = await DeviceRequest.updateDescription({
            content: { _id, description },
         });
         const content = apiThenContent(api);
         const inputItem = new ItemCustomerDevice(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            item.description = inputItem.description;
         });
      });
   };

   const deviceStore = new Vuex.Store(context);
   context.onGetStore(() => deviceStore);

   return deviceStore;
};

export default { init };
