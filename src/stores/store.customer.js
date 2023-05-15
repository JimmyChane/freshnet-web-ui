import Vuex from "vuex";
import ItemCustomer from "../items/Customer.js";
import CustomerRequest from "@/request/Customer";
import DeviceStore from "./store.device.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";

const init = (Stores) => {
   const deviceStore = DeviceStore.init(Stores);

   const context = new StoreBuilder()
      .onFetchItems(async () => {
         const api = await CustomerRequest.list();
         return api
            .optArrayContent()
            .map((content) => new ItemCustomer(Stores).fromData(content));
      })
      .onGetStore(() => Stores.customer)
      .action("refresh", async (context) => {
         context.state.dataLoader.doTimeout();
         await context.dispatch("getItems");
         await deviceStore.dispatch("refresh");
      })
      .action("getItems", async (context) => {
         return context.state.dataLoader.data();
      })
      .action("getItemOfId", async (context, id = "") => {
         if (!U.isString(id)) return null;
         const items = await context.dispatch("getItems");
         return items.find((item) => item.id === id) ?? null;
      })
      .action("getItemsOfIds", async (context, ids = []) => {
         if (!U.isArray(ids)) return [];

         const items = await context.dispatch("getItems");
         const results = ids.map((id) => {
            return items.find((item) => item.id === id) ?? null;
         });
         return results;
      })
      .action("generateCustomersAcross", async (context) => {
         const cloneCustomer = (customer) => {
            return new ItemCustomer(Stores).fromData(customer.toData());
         };

         const customers = await context.dispatch("getItems");
         for (const customer of customers) {
            customer.cachedServices = [];
            customer.cachedOrders = [];
         }
         const optCustomer = (eCustomer) => {
            let customer = customers.find((customer) => {
               const eName = U.optString(customer.name);
               const ePhoneNumberValue = customer.phoneNumber?.value ?? "";

               const name = U.optString(eCustomer.name);
               const phoneNumberValue = eCustomer.phoneNumber?.value ?? "";

               return eName === name && ePhoneNumberValue === phoneNumberValue;
            });

            if (!customer) {
               customer = cloneCustomer(eCustomer);
               customers.push(customer);
            }

            return customer;
         };

         const serviceGroups = await Stores.service.dispatch(
            "getGroupsByCustomer",
         );
         const orderGroups = await Stores.order.dispatch("getGroupsByCustomer");
         for (const serviceGroup of serviceGroups) {
            const customer = optCustomer(serviceGroup.customer);
            customer.cachedServices.push(...serviceGroup.items);
         }
         for (const orderGroup of orderGroups) {
            const customer = optCustomer(orderGroup.customer);
            customer.cachedOrders.push(...orderGroup.items);
         }

         return customers;
      })
      .action("addItem", async (context, arg = {}) => {
         const data = new ItemCustomer(Stores).fromData(arg).toData();
         delete data.id;
         const api = await CustomerRequest.add(data);
         const content = api.optObjectContent();
         const item = new ItemCustomer(Stores).fromData(content);
         return context.state.list.addItem(item);
      })
      .action("removeItemOfId", async (context, arg = { _id }) => {
         const { _id } = arg;
         const api = await CustomerRequest.remove(_id);
         const content = api.optObjectContent();
         const item = new ItemCustomer(Stores).fromData(content);
         return context.state.list.removeItemByItem(item);
      })
      .action(
         "updateNamePhoneNumberOfItemId",
         async (context, arg = { _id, name, phoneNumber }) => {
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
      )
      .action(
         "updateDescriptionOfId",
         async (context, arg = { _id, description }) => {
            const { _id, description } = arg;
            const api = await CustomerRequest.updateDescription(
               _id,
               description,
            );
            const content = api.optObjectContent();
            const inputItem = new ItemCustomer(Stores).fromData(content);
            return context.state.list.updateItemById(inputItem.id, (item) => {
               item.description = inputItem.description;
            });
         },
      );

   context.getters.devices = () => deviceStore.getters.items;

   // legacy
   context.actions.getDevices = () => deviceStore.dispatch("getItems");
   context.actions.getDeviceById = (context, id) =>
      deviceStore.dispatch("getItemOfId", id);
   context.actions.getDevicesByIds = (context, ids) =>
      deviceStore.dispatch("getItemsOfIds", ids);
   context.actions.addDevice = (context, arg) =>
      deviceStore.dispatch("addItem", arg);
   context.actions.removeDevice = (context, arg) =>
      deviceStore.dispatch("removeItemOfId", arg);
   context.actions.updateDeviceSpecifications = (context, arg) =>
      deviceStore.dispatch("updateSpecificationsOfId", arg);
   context.actions.updateDeviceDescription = (context, arg) =>
      deviceStore.dispatch("updateDescriptionOfId", arg);

   return new Vuex.Store(context.build());
};

export default { init };
