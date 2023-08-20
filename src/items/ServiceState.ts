import Server from "@/host/Server";

export default class ServiceState {
  static PENDING = new ServiceState(
    "pending",
    "Working",
    {
      white: Server.icon("page/service/pending-white").toUrl(),
      color: Server.icon("page/service/pending-color").toUrl(),
    },
    "#f4a60d",
  );
  static WAITING = new ServiceState(
    "waiting",
    "Waiting for Pickup",
    {
      white: Server.icon("page/service/waiting-white").toUrl(),
      color: Server.icon("page/service/waiting-color").toUrl(),
    },
    "#c336d9",
  );
  static COMPLETED = new ServiceState(
    "completed",
    "Finished & Pickup",
    {
      white: Server.icon("page/service/completed-white").toUrl(),
      color: Server.icon("page/service/completed-color").toUrl(),
    },
    "#25ad86",
  );
  static REJECTED = new ServiceState(
    "rejected",
    "Rejected & Pickup",
    {
      white: Server.icon("page/service/rejected-white").toUrl(),
      color: Server.icon("page/service/rejected-color").toUrl(),
    },
    "#d94136",
  );

  private static readonly LIST = [
    ServiceState.PENDING,
    ServiceState.WAITING,
    ServiceState.COMPLETED,
    ServiceState.REJECTED,
  ];

  static findByKey(key: string): ServiceState | undefined {
    return this.LIST.find((state) => state.key === key);
  }
  static indexOfKey(key: string): number {
    const state = this.findByKey(key);
    if (state === undefined) return -1;
    return this.LIST.indexOf(state);
  }
  static map(call: (state: ServiceState) => any): any[] {
    return this.LIST.map(call);
  }
  static count(): number {
    return this.LIST.length;
  }

  key: string;
  title: string;
  icon: { white: string; color: string };
  primaryColor: string;

  constructor(
    key: string = "",
    title: string = "",
    icon: { white: string; color: string } = { white: "", color: "" },
    primaryColor: string = "",
  ) {
    this.key = key;
    this.title = title;
    this.icon = icon;
    this.primaryColor = primaryColor;
  }
}
