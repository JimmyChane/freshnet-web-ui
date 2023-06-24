import ServiceTimestamp from "./ServiceTimestamp";
import ServiceEvent from "./ServiceEvent.js";
import ServicePrice from "./ServicePrice.js";
import ServiceCustomer from "./ServiceCustomer.js";
import ServiceImage from "./ServiceImage";
import Label from "./ServiceLabel";
import Method from "./ServiceEventMethod";
import State from "./ServiceState";

import U from "@/U.js";
import ItemSearcher from "../objects/ItemSearcher.js";
import ServiceBelonging from "./ServiceBelonging";
const textContains = ItemSearcher.textContains;

class Service {
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
      this.id = U.trimId(data._id);
      this.timestamp = data.time ? new ServiceTimestamp(data.time) : null;
      this.username = U.trimId(data.username);
      this.name = U.trimText(data.nameOfUser);

      switch (U.trimId(data.state)) {
         case State.PENDING.key:
            this.state = State.PENDING.key;
            break;
         case State.WAITING.key:
            this.state = State.WAITING.key;
            break;
         case State.COMPLETED.key:
            this.state = State.COMPLETED.key;
            break;
         case State.REJECTED.key:
            this.state = State.REJECTED.key;
            break;
         default:
            this.state = State.PENDING.key;
      }

      this.customer = U.isObject(data.customer)
         ? new ServiceCustomer(this.stores).fromData(data.customer)
         : undefined;
      this.description = U.trimText(data.description, "");
      this.belongings = U.optArray(data.belongings).map((belonging) => {
         return new ServiceBelonging(this.stores).fromData(belonging);
      });
      this.events = U.optArray(data.events).map((subData) => {
         return new ServiceEvent(this.stores).fromData(subData);
      });
      this.imageFiles = U.optArray(data.imageFiles).map((image) => {
         return new ServiceImage(this.stores).fromData(image);
      });

      this.labels = U.optArray(data.labels)
         .filter((subData) => subData.title !== " " || subData.title !== "")
         .map((subData) => new Label().fromData(subData));
      // refactoring notice to labels
      const notice = {
         isUrgent: !!data.notice?.isUrgent ?? false,
         isWarranty: !!data.notice?.isWarranty ?? false,
      };
      const existingLabelUrgent = this.labels.find((label) => {
         return label.title === Label.URGENT.title;
      });
      const existingLabelWarranty = this.labels.find((label) => {
         return label.title === Label.WARRANTY.title;
      });
      if (notice.isUrgent && !existingLabelUrgent)
         this.labels.push(Label.URGENT);
      if (notice.isWarranty && !existingLabelWarranty)
         this.labels.push(Label.WARRANTY);

      return this;
   }
   toData() {
      return {
         _id: U.trimId(this.id),
         time: this.timestamp?.time ?? null,
         username: U.trimId(this.username),
         nameOfUser: U.trimText(this.name),
         state: this.state,
         customer: this.customer.toData(),
         description: U.trimText(this.description, ""),
         belongings: this.belongings.map((belonging) => belonging.toData()),
         events: this.events.map((event) => event.toData()),
         imageFiles: this.imageFiles.map((image) => image.toData()),
         labels: this.labels.map((label) => label.toData()),
      };
   }
   toCount(strs) {
      const { customer, timestamp, state: stateKey, description } = this;

      const state = State.findByKey(stateKey);
      const stateTitle = state?.title ?? "";

      const ts = [
         "service",
         description,
         stateTitle,
         ...this.labels.map((label) => label.title),
      ];
      let count =
         strs.reduce((count, str) => {
            for (const t of ts) if (textContains(t, str)) count++;
            return count;
         }, 0) +
         this.events.reduce((count, event) => count + event.toCount(strs), 0);
      if (timestamp?.toCount(strs)) count++;
      if (customer?.toCount(strs)) count += 5;

      return count;
   }

   isUrgent() {
      return !!this.labels.find((label) => label.isEqual(Label.URGENT));
   }
   isWarranty() {
      return !!this.labels.find((label) => {
         return label.isEqual(Label.WARRANTY);
      });
   }

   compare(item) {
      let value = 0;
      if (value === 0) value = this.compareState(item);
      if (value === 0) value = this.compareTimestamp(item);
      return value;
   }
   compareState(item) {
      return State.indexOfKey(this.state) - State.indexOfKey(item.state);
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
      const username = user?.username ?? "";

      if (username.length && this.name) return `${this.name}(${username})`;
      if (!username.length && this.name) return this.name;
      if (username.length && !this.name) return username;

      throw new Error("unknown");
   }

   toTotalPrice() {
      return this.events.reduce((cost, event) => {
         if (event.method === Method.PURCHASE.key) {
            cost = cost.plus(event.price);
         }
         return cost;
      }, new ServicePrice().fromData({ amount: 0 }));
   }

   setLabels(labels = []) {
      this.labels = U.optArray(labels)
         .filter((label) => label.title !== " " || label.title !== "")
         .map((label) => new Label().fromData(label.toData()));
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
         ? this.addLabel(Label.URGENT)
         : this.removeLabel(Label.URGENT);
   }
   setWarranty(bool = false) {
      U.optBoolean(bool)
         ? this.addLabel(Label.WARRANTY)
         : this.removeLabel(Label.WARRANTY);
   }
}

export default Service;
