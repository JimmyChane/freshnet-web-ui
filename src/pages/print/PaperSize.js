import Host from "@/host/HostApi";
import Size from "./Size";

export default class PaperSize {
   static _4R = new PaperSize(
      "4R",
      Host.icon("paper-a4"),
      new Size("10.2cm", "15.2cm"),
   );
   static A4 = new PaperSize(
      "A4",
      Host.icon("paper-a4"),
      new Size("210mm", "297mm"),
   );
   static A3 = new PaperSize(
      "A3",
      Host.icon("paper-a3"),
      new Size("297mm", "420mm"),
   );

   constructor(title, icon, size) {
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
