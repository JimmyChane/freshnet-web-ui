import HostApi from "@/host/HostApi.js";
import ModuleService from "@/items/data/Service.js";

export default {
   list: [
      {
         key: ModuleService.State.Pending,
         title: "Pending",
         icon: {
            white: HostApi.icon("page/service/pending-white"),
            color: HostApi.icon("page/service/pending-color"),
         },
         color: "#f4a60d",
      },
      {
         key: ModuleService.State.Completed,
         title: "Completed",
         icon: {
            white: HostApi.icon("page/service/completed-white"),
            color: HostApi.icon("page/service/completed-color"),
         },
         color: "#25ad86",
      },
      {
         key: ModuleService.State.Rejected,
         title: "Rejected",
         icon: {
            white: HostApi.icon("page/service/rejected-white"),
            color: HostApi.icon("page/service/rejected-color"),
         },
         color: "#d94136",
      },
      {
         key: ModuleService.State.Waiting,
         title: "Waiting",
         icon: {
            white: HostApi.icon("page/service/waiting-white"),
            color: HostApi.icon("page/service/waiting-color"),
         },
         color: "#c336d9",
      },
   ],
   getResourceByKey(key) {
      return this.list.find((state) => state.key === key);
   },
};
