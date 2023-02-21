import HostApi from "@/host/HostApi.js";
import ModuleService from "@/items/data/Service.js";

class ServiceState {
   constructor(key, title, icon, color) {
      this.key = key;
      this.title = title;
      this.icon = icon;
      this.color = color;
   }
}

export default class ServiceStates {
   static Pending = new ServiceState(
      ModuleService.State.Pending,
      "Pending",
      {
         white: HostApi.icon("page/service/pending-white"),
         color: HostApi.icon("page/service/pending-color"),
      },
      "#f4a60d",
   );
   static Waiting = new ServiceState(
      ModuleService.State.Waiting,
      "Waiting",
      {
         white: HostApi.icon("page/service/waiting-white"),
         color: HostApi.icon("page/service/waiting-color"),
      },
      "#c336d9",
   );
   static Completed = new ServiceState(
      ModuleService.State.Completed,
      "Completed",
      {
         white: HostApi.icon("page/service/completed-white"),
         color: HostApi.icon("page/service/completed-color"),
      },
      "#25ad86",
   );
   static Rejected = new ServiceState(
      ModuleService.State.Rejected,
      "Rejected",
      {
         white: HostApi.icon("page/service/rejected-white"),
         color: HostApi.icon("page/service/rejected-color"),
      },
      "#d94136",
   );

   static list = [this.Pending, this.Waiting, this.Completed, this.Rejected];

   static findByKey(key) {
      return this.list.find((state) => state.key === key);
   }
}
