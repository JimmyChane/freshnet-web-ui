import U from "@/U";

class ServiceBelonging {
   stores = null;

   constructor(stores) {
      this.stores = stores;
   }

   title = "";
   time = 0;
   quantity = 1;
   description = "";

   fromData(data) {
      this.title = U.trimText(data.title);
      this.time = data.time;
      this.quantity = Math.max(U.optNumber(data.quantity), 1);
      this.description = U.trimText(data.description);
      return this;
   }
   toData() {
      return {
         title: U.trimText(this.title),
         time: this.time,
         quantity: Math.max(U.optNumber(this.quantity), 1),
         description: U.trimText(this.description),
      };
   }
}

export default ServiceBelonging;
