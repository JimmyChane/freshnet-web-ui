const ServiceCustomer = require("./ServiceCustomer.js");
const ServiceEvent = require("./ServiceEvent.js");
const ServiceBelonging = require("./ServiceBelonging.js");
const ServiceImageFile = require("./ServiceImageFile.js");
const ServiceNotice = require("./ServiceNotice.js");
const ServiceLabel = require("./ServiceLabel.js");
const PhoneNumber = require("./PhoneNumber.js");
const { default: U } = require("@/U.js");

class Service {
   static State = {
      Pending: "pending",
      Waiting: "waiting",
      Completed: "completed",
      Rejected: "rejected",
   };

   static search(item, searches) {
      const data = {
         description: U.optString(item.description),
         customerName: U.optString(item.customer?.name),
         customerNumber: U.isObject(item.customer)
            ? PhoneNumber.parseToString(item.customer.phoneNumber)
            : "",
         timeString: U.optString(item.timestamp).toString(),
         urgent: item.isUrgent() ? "urgent" : "",
         warranty: item.isWarranty() ? "warranty" : "",
      };

      const stateKey = Object.keys(Service.State).find((state) => {
         return state === item.state;
      });

      const contexts = [
         data.description,
         data.customerName,
         data.customerNumber,
         data.timeString,
         U.isString(stateKey) ? Service.State[stateKey] : "",
         data.urgent,
         data.warranty,
      ];

      const result = { item, matchCount: 0 };

      for (let context of contexts) {
         for (let search of searches) {
            if (context.toLowerCase().includes(search)) {
               result.matchCount += 1;
            }
         }
      }

      return result;
   }
   static trim(data) {
      return new Service(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.time = data.time;
      this.username = U.trimId(data.username);
      this.nameOfUser = U.trimText(data.nameOfUser);
      this.state = U.trimId(data.state);
      if (
         ![
            Service.State.Pending,
            Service.State.Waiting,
            Service.State.Completed,
            Service.State.Rejected,
         ].includes(this.state)
      ) {
         this.state = Service.State.Pending;
      }

      this.customer = U.isObject(data.customer)
         ? ServiceCustomer.trim(data.customer)
         : undefined;

      this.description = U.trimText(data.description, "");

      this.belongings = U.optArray(data.belongings).map((belonging) => {
         return ServiceBelonging.trim(belonging);
      });
      this.events = U.optArray(data.events).map((event) => {
         return ServiceEvent.trim(event);
      });
      this.imageFiles = U.optArray(data.imageFiles).map((imageFile) => {
         return ServiceImageFile.trim(imageFile);
      });

      // parsing notice
      this.notice = ServiceNotice.trim(
         U.optObjectOnly(data.notice, { isUrgent: false, isWarranty: false }),
      );

      // parsing labels
      this.labels = U.optArray(data.labels)
         .map((label) => new ServiceLabel(label))
         .filter((label) => label.title !== " " || label.title !== "");

      // refactoring notice to labels
      const existingLabelUrgent = this.labels.find((label) => {
         return label.title === ServiceLabel.Defaults.Urgent.title;
      });
      const existingLabelWarranty = this.labels.find((label) => {
         return label.title === ServiceLabel.Defaults.Warranty.title;
      });
      if (this.notice.isUrgent && !existingLabelUrgent) {
         this.labels.push(ServiceLabel.Defaults.Urgent);
      }
      if (this.notice.isWarranty && !existingLabelWarranty) {
         this.labels.push(ServiceLabel.Defaults.Warranty);
      }
   }
}

module.exports = Service;
