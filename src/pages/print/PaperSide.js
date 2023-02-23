import Host from "@/host/HostApi";

export default class PaperSide {
   static Front = new PaperSide("1 Side", Host.icon("paper-1sided"));
   static FrontBack = new PaperSide("2 Side", Host.icon("paper-2sided"));
   static FrontIc = new PaperSide(
      "1 Side IC Full Copy",
      Host.icon("paper-a4-1sided-ic"),
   );

   constructor(title, icon) {
      this.title = title;
      this.icon = icon;
   }
}
