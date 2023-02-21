import ServiceTimestamp from "./ServiceTimestamp";
import ServiceEvent from "./ServiceEvent.js";
import ServicePrice from "./ServicePrice.js";
import ServiceStates from "./tools/ServiceStates.js";
import ServiceCustomer from "./ServiceCustomer.js";
import ServiceImage from "./ServiceImage";
import ServiceLabel from "./ServiceLabel";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

import ModuleService from "./data/Service.js";
import ModuleEvent from "./data/ServiceEvent.js";
import ModuleLabel from "./data/ServiceLabel.js";

import U from "@/U.js";

const ServiceLabels = {
   Urgent: new ServiceLabel().fromData(ModuleLabel.Defaults.Urgent),
   Warranty: new ServiceLabel().fromData(ModuleLabel.Defaults.Warranty),
};

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
         time: this.timestamp ? this.timestamp.time : null,
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
      const stateTitle = stateRes ? stateRes.title : "";

      let count = strs.reduce((count, str) => {
         count += textContains("service", str) ? 1 : 0;
         count += textContains(description, str) ? 1 : 0;
         count += this.isUrgent() ? textContains("urgent", str) : 0;
         count += this.isWarranty() ? textContains("warranty", str) : 0;
         count += textContains(stateTitle, str) ? 1 : 0;
         return count;
      }, 0);
      count += this.events.reduce((count, event) => {
         count += event.toCount(strs);
         return count;
      }, 0);
      count += timestamp ? timestamp.toCount(strs) : 0;
      count += customer ? customer.toCount(strs) : 0;

      return count;
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
      if (!U.isString(this.username) || this.username.trim().length === 0) return null;
      return await this.userStore.dispatch("getUserByUsername", this.username);
   }
   async fetchName() {
      const user = await this.fetchUser();

      const username = user ? user.username : "";

      if (username.length && this.name) return `${this.name}(${username})`;
      if (!username.length && this.name) return this.name;
      if (username.length && !this.name) return username;

      throw new Error("unknown");
   }

   isUrgent() {
      return !!this.labels.find((label) => label.isEqual(ServiceLabels.Urgent));
   }
   isWarranty() {
      return !!this.labels.find((label) => label.isEqual(ServiceLabels.Warranty));
   }

   toTotalPrice() {
      return this.events.reduce((cost, event) => {
         if (event.method === ModuleEvent.Method.Purchase) {
            cost = cost.plus(event.price);
         }
         return cost;
      }, new ServicePrice().fromData({ amount: 0 }));
   }

   // deprecated
   setUrgent(bool) {
      const labels = this.labels;
      const existingLabel = labels.find((label) => {
         return label.isEqual(ServiceLabels.Urgent);
      });

      if (bool && !existingLabel) {
         this.setLabels([...labels, ServiceLabels.Urgent]);
      } else if (!bool && existingLabel) {
         this.setLabels(labels.filter((label) => !label.isEqual(ServiceLabels.Urgent)));
      }
   }
   // deprecated
   setWarranty(bool) {
      const labels = this.labels;
      const existingLabel = labels.find((label) => {
         return label.isEqual(ServiceLabels.Warranty);
      });

      if (bool && !existingLabel) {
         this.setLabels([...labels, ServiceLabels.Warranty]);
      } else if (!bool && existingLabel) {
         this.setLabels(labels.filter((label) => !label.isEqual(ServiceLabels.Warranty)));
      }
   }

   setLabels(labels) {
      this.labels = (Array.isArray(labels) ? labels : [])
         .filter((label) => label.title !== " " || label.title !== "")
         .map((label) => new ServiceLabel().fromData(label.toData()));
   }
}

export default Service;
