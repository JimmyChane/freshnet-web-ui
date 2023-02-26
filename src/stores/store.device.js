import Vuex from "vuex";
import ItemCustomerDevice from "../items/CustomerDevice.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import DeviceRequest from "@/request/Device";

const init = (Stores) => {
   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await DeviceRequest.list();
      return api
         .optArrayContent()
         .map((content) => new ItemCustomerDevice(Stores).fromData(content));
   });
   context.action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
   });
   context.action("getItems", async (context) => {
      return context.state.dataLoader.data();
   });
   context.action("getItemOfId", async (context, id = "") => {
      if (typeof id !== "string") return null;
      const items = await context.dispatch("getItems");
      const item = items.find((item) => item.id === id);
      return item ? item : null;
   });
   context.action("getItemsOfIds", async (context, ids = []) => {
      if (!U.isArray(ids)) return [];

      const items = await context.dispatch("getItems");
      const results = ids.map((id) => {
         const item = items.find((item) => item.id === id);
         return item ? item : null;
      });
      return results;
   });
   context.action("addItem", async (context, arg = {}) => {
      const data = new ItemCustomerDevice(Stores).fromData(arg).toData();
      delete data.id;
      const api = await DeviceRequest.add({ content: data });
      const content = api.optObjectContent();
      const item = context.state.list.addItem(
         new ItemCustomerDevice(Stores).fromData(content),
      );
      const customer = Stores.customer.getters.items.find((customer) => {
         return customer.id === item.ownerCustomerId;
      });
      if (customer) customer.deviceIds.push(item.id);
      return item;
   });
   context.action("removeItemOfId", async (context, arg = {}) => {
      const api = await DeviceRequest.remove({
         content: {
            ownerCustomerId: arg.ownerCustomerId,
            deviceId: arg.id,
         },
      });
      const content = api.optObjectContent();
      const item = new ItemCustomerDevice(Stores).fromData(content);
      const customer = Stores.customer.getters.customers.find((customer) => {
         return customer.id === item.ownerCustomerId;
      });
      customer.deviceIds = customer.deviceIds.filter((deviceId) => {
         return deviceId !== item.id;
      });

      return context.state.list.removeItemByItem(item);
   });
   context.action(
      "updateSpecificationsOfId",
      async (context, arg = { _id, specifications }) => {
         const { _id, specifications } = arg;
         const api = await DeviceRequest.updateSpecification({
            content: { _id, specifications },
         });
         const content = api.optObjectContent();
         const inputItem = new ItemCustomerDevice(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            item.specifications = inputItem.specifications;
         });
      },
   );
   context.action(
      "updateDescriptionOfId",
      async (context, arg = { _id, description }) => {
         const { _id, description } = arg;
         const api = await DeviceRequest.updateDescription({
            content: { _id, description },
         });
         const content = api.optObjectContent();
         const inputItem = new ItemCustomerDevice(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            item.description = inputItem.description;
         });
      },
   );

   const deviceStore = new Vuex.Store(context.build());
   context.onGetStore(() => deviceStore);

   return deviceStore;
};

export default { init };
