const Text = require("./Text.js");

class Order {
   static Status = { Pending: 0, Completed: 1 };

   static trim(data) {
      return new Order(data);
   }

   constructor(data = null) {
      this._id = Text.trim(data._id, data._id);
      this.content = Text.trim(data.content, "");
      this.customer_name = Text.trim(data.customer_name, "");
      this.phone_number = Text.trim(data.phone_number, "");
      this.status =
         data.status !== Order.Status.Completed
            ? Order.Status.Pending
            : Order.Status.Completed;
      this.createdAt = data.createdAt;
   }
}

module.exports = Order;
