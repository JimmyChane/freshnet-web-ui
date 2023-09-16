import Host from "@/host/Server";
import IconPaper1 from "@/assets/icon/paper-1sided.svg";
import IconPaper2 from "@/assets/icon/paper-2sided.svg";
import IconPaperA4Ic1 from "@/assets/icon/paper-a4-1sided-ic.svg";

export default class PaperSide {
  static readonly Front = new PaperSide("1 Side", IconPaper1);
  static readonly FrontBack = new PaperSide("2 Side", IconPaper2);
  static readonly FrontIc = new PaperSide(
    "1 Side IC Full Copy",
    IconPaperA4Ic1,
  );

  title: string;
  icon: string;

  constructor(title: string, icon: string) {
    this.title = title;
    this.icon = icon;
  }
}
