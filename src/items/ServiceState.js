import HostApi from "@/host/HostApi.js";

class ServiceState {
   static PENDING = new ServiceState(
      "pending",
      "Working",
      {
         white: HostApi.icon("page/service/pending-white"),
         color: HostApi.icon("page/service/pending-color"),
      },
      "#f4a60d",
   );
   static WAITING = new ServiceState(
      "waiting",
      "Waiting for Pickup",
      {
         white: HostApi.icon("page/service/waiting-white"),
         color: HostApi.icon("page/service/waiting-color"),
      },
      "#c336d9",
   );
   static COMPLETED = new ServiceState(
      "completed",
      "Finished & Pickup",
      {
         white: HostApi.icon("page/service/completed-white"),
         color: HostApi.icon("page/service/completed-color"),
      },
      "#25ad86",
   );
   static REJECTED = new ServiceState(
      "rejected",
      "Rejected & Pickup",
      {
         white: HostApi.icon("page/service/rejected-white"),
         color: HostApi.icon("page/service/rejected-color"),
      },
      "#d94136",
   );

   static #LIST = [this.PENDING, this.WAITING, this.COMPLETED, this.REJECTED];

   static findByKey(key) {
      return this.#LIST.find((state) => state.key === key);
   }
   static indexOfKey(key) {
      const state = this.findByKey(key);
      return this.#LIST.indexOf(state);
   }
   static map(call = (state) => {}) {
      return this.#LIST.map(call);
   }
   static length() {
      return this.#LIST.length;
   }

   constructor(
      key = "",
      title = "",
      icon = { white: "", color: "" },
      primaryColor = "",
   ) {
      this.key = key;
      this.title = title;
      this.icon = icon;
      this.primaryColor = primaryColor;
   }
}

export default ServiceState;
