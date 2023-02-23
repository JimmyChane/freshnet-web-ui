import ModuleCustomerDevice from "./data/CustomerDevice.js";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class CustomerDevice {
   stores = null;
   categoryStore = null;
   customerStore = null;

   constructor(stores) {
      this.stores = stores;
      this.categoryStore = stores.category;
      this.customerStore = stores.customer;
   }

   id = "";
   ownerCustomerId = "";
   description = "";
   categoryKey = "";
   specifications = [];

   fromData(data) {
      data = ModuleCustomerDevice.trim(data);

      this.id = data._id;
      this.ownerCustomerId = data.ownerCustomerId;
      this.description = data.description;
      this.categoryKey = data.categoryKey;
      this.specifications = data.specifications;

      return this;
   }
   toData() {
      return {
         _id: this.id,
         ownerCustomerId: this.ownerCustomerId,
         description: this.description,
         categoryKey: this.categoryKey,
         specifications: this.specifications.map((specification) => specification),
      };
   }
   toCount(strs) {
      const count = strs.reduce((count, str) => {
         if (textContains(this.ownerCustomerId, str)) count++;
         if (textContains(this.description, str)) count++;
         if (textContains(this.categoryKey, str)) count++;
         count += this.specifications.reduce((count, specification) => {
            return count + textContains(specification, str);
         }, 0);
         return count;
      }, 0);

      return count;
   }

   compare(item) {
      return 0;
   }

   async fetchCustomer() {
      const customers = await this.customerStore.dispatch("getItems");
      return customers.find((customer) => customer.id === this.ownerCustomerId);
   }
   async fetchCategory() {
      const categories = await this.categoryStore.dispatch("getItems");
      return categories.find((category) => category.key === this.categoryKey);
   }
}

export default CustomerDevice;
