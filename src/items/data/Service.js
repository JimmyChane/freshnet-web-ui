const Text = require("./Text.js");
const ServiceCustomer = require("./ServiceCustomer.js");
const ServiceEvent = require("./ServiceEvent.js");
const ServiceBelonging = require("./ServiceBelonging.js");
const ServiceImageFile = require("./ServiceImageFile.js");
const ServiceNotice = require("./ServiceNotice.js");
const ServiceLabel = require("./ServiceLabel.js");
const PhoneNumber = require("./PhoneNumber.js");

class Service {
   static State = {
      Pending: "pending",
      Waiting: "waiting",
      Completed: "completed",
      Rejected: "rejected",
   };

   static search(item, searches) {
      const data = {
         description: Text.parse(item.description),
         customerName:
            typeof item.customer === "object" ? Text.parse(item.customer.name) : "",
         customerNumber:
            typeof item.customer === "object"
               ? PhoneNumber.parseToString(item.customer.phoneNumber)
               : "",
         timeString: (item.timestamp ? item.timestamp : "").toString(),
         urgent: item.isUrgent() ? "urgent" : "",
         warranty: item.isWarranty() ? "warranty" : "",
      };

      const stateKey = Object.keys(Service.State).find((state) => state === item.state);

      const contexts = [
         data.description,
         data.customerName,
         data.customerNumber,
         data.timeString,
         typeof stateKey === "string" ? Service.State[stateKey] : "",
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
      this._id = Text.trim(data._id, data._id);
      this.time = data.time;
      this.username = Text.trim(data.username, "").replace(" ", "");
      this.nameOfUser = Text.trim(data.nameOfUser, "");

      this.state = Text.trim(data.state, Service.State.Pending).replace(" ", "");

      this.customer =
         typeof data.customer === "object"
            ? ServiceCustomer.trim(data.customer)
            : undefined;

      this.description = Text.trim(data.description, "");

      this.belongings = (Array.isArray(data.belongings) ? data.belongings : []).map(
         (belonging) => ServiceBelonging.trim(belonging)
      );

      this.events = (Array.isArray(data.events) ? data.events : []).map((event) =>
         ServiceEvent.trim(event)
      );

      this.imageFiles = (Array.isArray(data.imageFiles) ? data.imageFiles : []).map(
         (imageFile) => ServiceImageFile.trim(imageFile)
      );

      // parsing notice
      this.notice = ServiceNotice.trim(
         typeof data.notice === "object" && data.notice
            ? data.notice
            : { isUrgent: false, isWarranty: false }
      );

      // parsing labels
      this.labels = (Array.isArray(data.labels) ? data.labels : [])
         .map((label) => new ServiceLabel(label))
         .filter((label) => label.title !== " " || label.title !== "");

      // refactoring notice to labels
      const existingLabelUrgent = this.labels.find(
         (label) => label.title === ServiceLabel.Defaults.Urgent.title
      );
      const existingLabelWarranty = this.labels.find(
         (label) => label.title === ServiceLabel.Defaults.Warranty.title
      );
      if (this.notice.isUrgent && !existingLabelUrgent)
         this.labels.push(ServiceLabel.Defaults.Urgent);
      if (this.notice.isWarranty && !existingLabelWarranty)
         this.labels.push(ServiceLabel.Defaults.Warranty);
   }
}

module.exports = Service;
