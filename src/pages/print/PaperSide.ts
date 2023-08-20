import Host from "@/host/Server";

export default class PaperSide {
  static readonly Front = new PaperSide(
    "1 Side",
    Host.icon("paper-1sided").toUrl(),
  );
  static readonly FrontBack = new PaperSide(
    "2 Side",
    Host.icon("paper-2sided").toUrl(),
  );
  static readonly FrontIc = new PaperSide(
    "1 Side IC Full Copy",
    Host.icon("paper-a4-1sided-ic").toUrl(),
  );

  title: string;
  icon: string;

  constructor(title: string, icon: string) {
    this.title = title;
    this.icon = icon;
  }
}
