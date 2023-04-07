import Vuex from "vuex";
import Order from "@/items/Order.js";
import U from "@/U";
import StoreBuilder from "./tools/StoreBuilder";
import OrderRequest from "@/request/Order";

const init = (Stores) => {
   const context = new StoreBuilder()
      .onFetchItems(async () => {
         const api = await OrderRequest.list();
         return api
            .optArrayContent()
            .map((data) => new Order(Stores).fromData(data));
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
      })
      .action("getGroupsByStatus", async (context) => {
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
      })

      .action("addItem", async (context, arg = { data }) => {
         const { data } = arg;
         if (!data) return null;
         const api = await OrderRequest.add(data);
         return context.state.list.addItem(
            new Order().fromData(api.optObjectContent()),
         );
      })
      .action("removeOItemOfId", async (context, arg = { id }) => {
         const { id } = arg;
         const api = await OrderRequest.delete(id);
         api.getContent();
         context.state.list.removeItemById(id);
      })
      .action("updateStatusOfId", async (context, arg = { id, status }) => {
         const { id, status } = arg;
         const api = await OrderRequest.updateStatus(id, status);
         api.getContent();
         return context.state.list.updateItemById(id, (item) => {
            item.status = status;
         });
      })

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
