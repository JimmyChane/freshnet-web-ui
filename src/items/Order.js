import ModuleOrder from "./data/Order.js";
import OrderCustomer from "./OrderCustomer.js";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class Order {
   static STATUS = {
      PENDING: ModuleOrder.Status.Pending,
      COMPLETED: ModuleOrder.Status.Completed,
   };
   static STATUS_PENDING = ModuleOrder.Status.Pending; // legacy
   static STATUS_COMPLETED = ModuleOrder.Status.Completed; //legacy

   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   id = "";
   customer = null;
   content = "";
   createdAt = "";
   status = Order.STATUS_PENDING;

   fromData(data) {
      data = ModuleOrder.trim(data);

      this.id = data._id;
      this.customer = new OrderCustomer(this.stores).fromData({
         name: data.customer_name,
         phoneNumber: data.phone_number,
      });
      this.content = data.content;
      this.createdAt = data.createdAt;
      this.status = data.status;

      return this;
   }
   toData() {
      const customer = this.customer.toData();
      return {
         _id: this.id,
         content: this.content,
         customer_name: customer.name,
         phone_number: customer.phoneNumber,
         createdAt: this.createdAt,
         status: this.status,
      };
   }
   toCount(strs) {
      let count = strs.reduce((count, str) => {
         if (textContains("order", str)) count++;
         if (textContains(this.content, str)) count++;
         if (textContains(this.status, str)) count++;
         return count;
      }, 0);
      count += this.customer.toCount(strs);

      return count;
   }

   compare(item) {
      return 0;
   }
}

export default Order;
