import Vuex from "vuex";
import Order from "@/items/Order";
 
import StoreBuilder from "./tools/StoreBuilder";
import OrderRequest from "@/request/Order";
import Customer from "@/items/Customer";
import OrderCustomer from "@/items/OrderCustomer";

const init = (Stores: any) => {
  const context = new StoreBuilder<Order>()
    .onFetchItems(async () => {
      const api = await OrderRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((data) => new Order(Stores).fromData(data));
    })
    .onGetStore(() => Stores.order)

    .action("refresh", async (context) => {
      context.state.dataLoader.doTimeout();
      await context.dispatch("getItems");
    })

    .action("getItems", async (context) => {
      return context.state.dataLoader.data();
    })

    .action("getGroupsByCustomer", async (context) => {
      interface Group {
        customer: OrderCustomer | null;
        items: Order[];
      }

      const items: Order[] = await context.dispatch("getItems");
      const groups: Group[] = items.reduce((groups: Group[], item: Order) => {
        let group: Group | undefined = groups.find((group: Group) => {
          if (group.customer === item.customer) return true;
          if (item.customer === null || group.customer === null) return true;
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
    })
    .action("getGroupsByStatus", async (context) => {
      interface Group {
        status: number;
        items: Order[];
      }

      const items = await context.dispatch("getItems");
      const groups: Group[] = items.reduce((groups: Group[], item: Order) => {
        let group: Group | undefined = groups.find((group: Group) => {
          return group.status === item.status;
        });

        if (!group) {
          group = { status: item.status, items: [] };
          groups.push(group);
        }

        group.items.push(item);
        return groups;
      }, []);

      return groups;
    })

    .action("addItem", async (context, arg: { data: any }) => {
      const { data } = arg;
      if (!data) return null;
      const api = await OrderRequest.add(data);
      const order = new Order(Stores).fromData(api.optObjectContent());
      return context.state.list.addItem(order);
    })
    .action("removeOItemOfId", async (context, arg: { id: string }) => {
      const { id } = arg;
      const api = await OrderRequest.delete(id);
      api.getContent();
      context.state.list.removeItemById(id);
    })
    .action(
      "updateStatusOfId",
      async (context, arg: { id: string; status: number }) => {
        const { id, status } = arg;
        const api = await OrderRequest.updateStatus(id, status);
        api.getContent();
        return context.state.list.updateItemById(id, (item) => {
          if (!item) return;
          item.status = status;
        });
      },
    )

    .action("updateToPendingOfId", async (context, id = "") => {
      const status = Order.Status.Pending;
      return context.dispatch("updateStatusOfId", { id, status });
    })
    .action("updateToCompletedOfId", async (context, id = "") => {
      const status = Order.Status.Completed;
      return context.dispatch("updateStatusOfId", { id, status });
    })
    .build();

  return new Vuex.Store(context);
};

export default { init };
