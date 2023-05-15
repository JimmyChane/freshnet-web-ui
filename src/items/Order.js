import OrderCustomer from "./OrderCustomer.js";
import ItemSearcher from "../objects/ItemSearcher.js";
import U from "@/U.js";
const textContains = ItemSearcher.textContains;

class Order {
   static Status = { Pending: 0, Completed: 1 };

   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   id = "";
   customer = null;
   content = "";
   createdAt = "";
   status = Order.Status.Pending;

   fromData(data) {
      this.id = U.trimId(data._id);
      this.customer = new OrderCustomer(this.stores).fromData({
         name: U.trimText(data.customer_name),
         phoneNumber: U.trimText(data.phone_number),
      });
      this.content = U.trimText(data.content);
      this.createdAt = data.createdAt;
      this.status = data.status;
      this.status =
         data.status !== Order.Status.Completed
            ? Order.Status.Pending
            : Order.Status.Completed;

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
