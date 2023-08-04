import Vuex from "vuex";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import DeviceRequest from "@/request/Device";
import CustomerDevice from "../items/CustomerDevice";
import Customer from "@/items/Customer";

const init = (Stores: any) => {
  const context = new StoreBuilder<CustomerDevice>()
    .onFetchItems(async () => {
      const api = await DeviceRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => {
        return new CustomerDevice(Stores).fromData(content);
      });
    })
    .action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
    })
    .action("getItems", async (context) => {
      return context.state.dataLoader.data();
    })
    .action("getItemOfId", async (context, id = "") => {
      if (typeof id !== "string") return null;
      const items: CustomerDevice[] = await context.dispatch("getItems");
      return items.find((item) => item.id === id) ?? null;
    })
    .action("getItemsOfIds", async (context, ids: string[] = []) => {
      if (!U.isArray(ids)) return [];

      const items: CustomerDevice[] = await context.dispatch("getItems");
      const results = ids.map((id) => {
        return items.find((item) => item.id === id) ?? null;
      });
      return results;
    })
    .action("addItem", async (context, arg = {}) => {
      const data: any = new CustomerDevice(Stores).fromData(arg).toData();
      delete data.id;
      const api = await DeviceRequest.add({ content: data });
      const content = api.optObjectContent();
      const item = context.state.list.addItem(
        new CustomerDevice(Stores).fromData(content),
      );
      if (item) {
        const customers: Customer[] = Stores.customer.getters.items;
        const customer = customers.find((customer) => {
          return customer.id === item.ownerCustomerId;
        });
        if (customer) customer.deviceIds.push(item.id);
      }
      return item;
    })
    .action("removeItemOfId", async (context, arg = {}) => {
      const api = await DeviceRequest.remove({
        content: {
          ownerCustomerId: arg.ownerCustomerId,
          deviceId: arg.id,
        },
      });
      const content = api.optObjectContent();
      const item = new CustomerDevice(Stores).fromData(content);
      const customer = Stores.customer.getters.items.find(
        (customer: Customer) => {
          return customer.id === item.ownerCustomerId;
        },
      );
      customer.deviceIds = customer.deviceIds.filter((deviceId: string) => {
        return deviceId !== item.id;
      });

      return context.state.list.removeItemByItem(item);
    })
    .action(
      "updateSpecificationsOfId",
      async (context, arg: { _id: string; specifications: any[] }) => {
        const { _id, specifications } = arg;
        const api = await DeviceRequest.updateSpecification({
          content: { _id, specifications },
        });
        const content = api.optObjectContent();
        const inputItem = new CustomerDevice(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
          if (!item) return;
          item.specifications = inputItem.specifications;
        });
      },
    )
    .action(
      "updateDescriptionOfId",
      async (context, arg: { _id: string; description: string }) => {
        const { _id, description } = arg;
        const api = await DeviceRequest.updateDescription({
          content: { _id, description },
        });
        const content = api.optObjectContent();
        const inputItem = new CustomerDevice(Stores).fromData(content);
        return context.state.list.updateItemById(inputItem.id, (item) => {
          if (!item) return;
          item.description = inputItem.description;
        });
      },
    );

  const deviceStore = new Vuex.Store(context.build());
  context.onGetStore(() => deviceStore);

  return deviceStore;
};

export default { init };
