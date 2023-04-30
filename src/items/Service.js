import ServiceTimestamp from "./ServiceTimestamp";
import ServiceEvent from "./ServiceEvent.js";
import ServicePrice from "./ServicePrice.js";
import ServiceStates from "@/objects/ServiceStates.js";
import ServiceCustomer from "./ServiceCustomer.js";
import ServiceImage from "./ServiceImage";
import ServiceLabel from "./ServiceLabel";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

import ModuleService from "./data/Service.js";
import ModuleEvent from "./data/ServiceEvent.js";

import U from "@/U.js";

class Service {
   static #serviceStates = Object.keys(ModuleService.State).map((key) => {
      return ModuleService.State[key];
   });

   stores = null;
   userStore = null;

   constructor(stores) {
      this.stores = stores;
      this.userStore = stores.user;
   }

   id = "";
   timestamp = null;
   username = "";
   name = "";
   state = "";
   customer = null;
   description = "";
   belongings = [];
   events = [];
   imageFiles = [];
   labels = [];

   fromData(data) {
      data = new ModuleService(data);

      this.id = data._id;
      this.timestamp = data.time ? new ServiceTimestamp(data.time) : null;
      this.username = data.username;
      this.name = data.nameOfUser;
      this.state = data.state;
      this.customer = new ServiceCustomer(this.stores).fromData(data.customer);
      this.description = data.description;
      this.belongings = data.belongings;
      this.events = U.optArray(data.events).map((subData) => {
         return new ServiceEvent(this.stores).fromData(subData);
      });
      this.imageFiles = U.optArray(data.imageFiles).map((image) => {
         return new ServiceImage(this.stores).fromData(image);
      });
      this.labels = U.optArray(data.labels)
         .filter((subData) => subData.title !== " " || subData.title !== "")
         .map((subData) => new ServiceLabel().fromData(subData));

      return this;
   }
   toData() {
      return new ModuleService({
         _id: this.id,
         time: this.timestamp?.time ?? null,
         username: this.username,
         nameOfUser: this.name,
         state: this.state,
         customer: this.customer.toData(),
         description: this.description,
         belongings: this.belongings.map((belonging) => belonging),
         events: this.events.map((event) => event.toData()),
         imageFiles: this.imageFiles.map((image) => image.toData()),
         labels: this.labels.map((label) => label.toData()),
      });
   }
   toCount(strs) {
      const { customer, timestamp, state, description } = this;

      const stateRes = ServiceStates.findByKey(state);
      const stateTitle = stateRes?.title ?? "";

      let count = strs.reduce((count, str) => {
         if (textContains("service", str)) count++;
         if (textContains(description, str)) count++;
         if (this.isUrgent() && textContains("warranty", str)) count++;
         if (this.isWarranty() && textContains("warranty", str)) count++;
         if (textContains(stateTitle, str)) count++;
         return count;
      }, 0);
      count += this.events.reduce(
         (count, event) => count + event.toCount(strs),
         0,
      );
      if (timestamp && timestamp.toCount(strs)) count++;
      if (customer && customer.toCount(strs)) count++;

      return count;
   }

   isUrgent() {
      return !!this.labels.find((label) => label.isEqual(ServiceLabel.URGENT));
   }
   isWarranty() {
      return !!this.labels.find((label) => {
         return label.isEqual(ServiceLabel.WARRANTY);
      });
   }

   compare(item) {
      let value = 0;
      if (value === 0) value = this.compareState(item);
      if (value === 0) value = this.compareTimestamp(item);
      return value;
   }
   compareState(item) {
      return (
         Service.#serviceStates.indexOf(this.state) -
         Service.#serviceStates.indexOf(item.state)
      );
   }
   compareTimestamp(item) {
      return this.timestamp.compare(item.timestamp);
   }
   compareCustomer(item) {
      return this.customer.compare(item.customer);
   }
   compareTotalPrice(item) {
      const totalPrice1 = this.toTotalPrice();
      const totalPrice2 = item.toTotalPrice();
      return totalPrice1.compare(totalPrice2);
   }

   async fetchUser() {
      if (!U.isString(this.username) || this.username.trim().length === 0) {
         return null;
      }
      return await this.userStore.dispatch("getUserByUsername", this.username);
   }
   async fetchName() {
      const user = await this.fetchUser();

      const username = user ? user.username : "";

      if (username.length && this.name) {
         return `${this.name}(${username})`;
      }
      if (!username.length && this.name) {
         return this.name;
      }
      if (username.length && !this.name) {
         return username;
      }

      throw new Error("unknown");
   }

   toTotalPrice() {
      return this.events.reduce((cost, event) => {
         if (event.method === ModuleEvent.Method.Purchase) {
            cost = cost.plus(event.price);
         }
         return cost;
      }, new ServicePrice().fromData({ amount: 0 }));
   }

   setLabels(labels = []) {
      this.labels = U.optArray(labels)
         .filter((label) => label.title !== " " || label.title !== "")
         .map((label) => new ServiceLabel().fromData(label.toData()));
   }
   addLabel(label = null) {
      const labels = this.labels;
      const existingLabel = labels.find((l) => l.isEqual(label));

      if (!existingLabel) {
         this.setLabels([...labels, label]);
      }
   }
   removeLabel(label = null) {
      const labels = this.labels;
      const existingLabel = labels.find((l) => l.isEqual(label));

      if (existingLabel) {
         this.setLabels(labels.filter((l) => !l.isEqual(label)));
      }
   }

   setUrgent(bool = false) {
      U.optBoolean(bool)
         ? this.addLabel(ServiceLabel.URGENT)
         : this.removeLabel(ServiceLabel.URGENT);
   }
   setWarranty(bool = false) {
      U.optBoolean(bool)
         ? this.addLabel(ServiceLabel.WARRANTY)
         : this.removeLabel(ServiceLabel.WARRANTY);
   }
}

export default Service;
