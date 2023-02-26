import Vuex from "vuex";
import ItemCustomer from "../items/Customer.js";
import CustomerRequest from "@/request/Customer";
import DeviceStore from "./store.device.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

const getItemOfId = async (context, id = "") => {
   return context.state.processor.acquire("getItemOfId", async () => {
      if (!U.isString(id)) return null;
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
   const deviceStore = DeviceStore.init(Stores);

   const context = new StoreBuilder().onFetchItems(async () => {
      const api = await CustomerRequest.list();
      return api
         .optArrayContent()
         .map((content) => new ItemCustomer(Stores).fromData(content));
   });
   context.onGetStore(() => Stores.customer);
   context.build();
   context.getters.devices = () => deviceStore.getters.items;

   context.actions.refresh = async (context) => {
      await context.state.processor.acquire("refresh", async () => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
      });
      await deviceStore.dispatch("refresh");
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

   context.actions.generateCustomersAcross = async (context) => {
      const customers = (await context.dispatch("getItems")).map((customer) => {
         customer = new ItemCustomer(Stores).fromData(customer.toData());
         customer.services = [];
         customer.orders = [];

         return customer;
      });
      const optCustomer = (eCustomer) => {
         let customer = customers.find((customer) => {
            const eName = U.optString(customer.name);
            const ePhoneNumber = customer.phoneNumber;
            const ePhoneNumberValue = ePhoneNumber ? ePhoneNumber.value : "";

            const name = U.optString(eCustomer.name);
            const phoneNumber = eCustomer.phoneNumber;
            const phoneNumberValue = phoneNumber ? phoneNumber.value : "";

            return eName === name && ePhoneNumberValue === phoneNumberValue;
         });

         if (!customer) {
            customer = new ItemCustomer(Stores).fromData(eCustomer.toData());
            customer.services = [];
            customer.orders = [];
            customers.push(customer);
         }

         return customer;
      };

      const serviceGroups = await Stores.service.dispatch("getGroupsByCustomer");
      const orderGroups = await Stores.order.dispatch("getGroupsByCustomer");
      for (const serviceGroup of serviceGroups) {
         optCustomer(serviceGroup.customer).services.push(...serviceGroup.items);
      }
      for (const orderGroup of orderGroups) {
         optCustomer(orderGroup.customer).orders.push(...orderGroup.items);
      }

      return customers;
   };

   context.actions.addItem = async (context, arg = {}) => {
      return context.state.processor.acquire("addItem", async () => {
         const data = new ItemCustomer(Stores).fromData(arg).toData();
         delete data.id;
         const api = await CustomerRequest.add(data);
         const content = api.optObjectContent();
         return context.state.list.addItem(new ItemCustomer(Stores).fromData(content));
      });
   };
   context.actions.removeItemOfId = async (context, arg = { _id }) => {
      return context.state.processor.acquire("removeItemOfId", async () => {
         const { _id } = arg;
         const api = await CustomerRequest.remove(_id);
         const content = api.optObjectContent();
         return context.state.list.removeItemByItem(
            new ItemCustomer(Stores).fromData(content),
         );
      });
   };

   context.actions.updateNamePhoneNumberOfId = async (
      context,
      arg = { _id, name, phoneNumber },
   ) => {
      return context.state.processor.acquire(
         "updateNamePhoneNumberOfItemId",
         async () => {
            const { _id, name, phoneNumber } = arg;
            const api = await CustomerRequest.updateNamePhoneNumber(
               _id,
               name,
               phoneNumber,
            );
            const content = api.optObjectContent();
            const inputItem = new ItemCustomer(Stores).fromData(content);
            return context.state.list.updateItemById(inputItem.id, (item) => {
               item.name = inputItem.name;
               item.phoneNumber = inputItem.phoneNumber;
            });
         },
      );
   };
   context.actions.updateDescriptionOfId = async (
      context,
      arg = { _id, description },
   ) => {
      return context.state.processor.acquire("updateDescriptionOfId", async () => {
         const { _id, description } = arg;
         const api = await CustomerRequest.updateDescription(_id, description);
         const content = api.optObjectContent();
         const inputItem = new ItemCustomer(Stores).fromData(content);
         return context.state.list.updateItemById(inputItem.id, (item) => {
            item.description = inputItem.description;
         });
      });
   };

   // legacy

   context.actions.getDevices = () => deviceStore.dispatch("getItems");
   context.actions.getDeviceById = (context, id) =>
      deviceStore.dispatch("getItemOfId", id);
   context.actions.getDevicesByIds = (context, ids) =>
      deviceStore.dispatch("getItemsOfIds", ids);
   context.actions.addDevice = (context, arg) => deviceStore.dispatch("addItem", arg);
   context.actions.removeDevice = (context, arg) =>
      deviceStore.dispatch("removeItemOfId", arg);
   context.actions.updateDeviceSpecifications = (context, arg) =>
      deviceStore.dispatch("updateSpecificationsOfId", arg);
   context.actions.updateDeviceDescription = (context, arg) =>
      deviceStore.dispatch("updateDescriptionOfId", arg);

   return new Vuex.Store(context);
};

export default { init };
