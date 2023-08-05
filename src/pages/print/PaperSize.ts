import Host from "@/host/Server";
import Size from "./Size";
import { Icon } from "@/host/ServerResource";

export default class PaperSize {
  static readonly _4R = new PaperSize(
    "4R",
    Host.icon("paper-a4").toUrl(),
    new Size("10.2cm", "15.2cm"),
  );
  static readonly A4 = new PaperSize(
    "A4",
    Host.icon("paper-a4").toUrl(),
    new Size("210mm", "297mm"),
  );
  static readonly A3 = new PaperSize(
    "A3",
    Host.icon("paper-a3").toUrl(),
    new Size("297mm", "420mm"),
  );

  title: string;
  icon: string;
  size: Size;

  constructor(title: string, icon: string, size: Size) {
    this.title = title;
    this.icon = icon;
    this.size = size;
  }

  get width() {
    return this.size.width;
  }
  get height() {
    return this.size.height;
  }
  toString() {
    return this.size.toString();
  }
}
