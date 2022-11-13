import ApiHost from "@/host/ApiHost.js";
import ModuleService from "@/items/data/Service.js";

export default {
   list: [
      {
         key: ModuleService.State.Pending,
         title: "Pending",
         icon: {
            white: ApiHost.res("icon/page/service/pending-white.svg"),
            color: ApiHost.res("icon/page/service/pending-color.svg"),
         },
         color: "#f4a60d",
      },
      {
         key: ModuleService.State.Completed,
         title: "Completed",
         icon: {
            white: ApiHost.res("icon/page/service/completed-white.svg"),
            color: ApiHost.res("icon/page/service/completed-color.svg"),
         },
         color: "#25ad86",
      },
      {
         key: ModuleService.State.Rejected,
         title: "Rejected",
         icon: {
            white: ApiHost.res("icon/page/service/rejected-white.svg"),
            color: ApiHost.res("icon/page/service/rejected-color.svg"),
         },
         color: "#d94136",
      },
      {
         key: ModuleService.State.Waiting,
         title: "Waiting",
         icon: {
            white: ApiHost.res("icon/page/service/waiting-white.svg"),
            color: ApiHost.res("icon/page/service/waiting-color.svg"),
         },
         color: "#c336d9",
      },
   ],
   getResourceByKey(key) {
      return this.list.find((state) => state.key === key);
   },
};
