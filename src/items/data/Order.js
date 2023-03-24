const { default: U } = require("@/U.js");

class Order {
   static Status = { Pending: 0, Completed: 1 };

   static trim(data) {
      return new Order(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.content = U.trimText(data.content);
      this.customer_name = U.trimText(data.customer_name);
      this.phone_number = U.trimText(data.phone_number);
      this.status =
         data.status !== Order.Status.Completed
            ? Order.Status.Pending
            : Order.Status.Completed;
      this.createdAt = data.createdAt;
   }
}

module.exports = Order;
