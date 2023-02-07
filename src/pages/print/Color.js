import Host from "@/host/HostApi";

export default class Color {
   static BlackWhite = new Color("Black & White", Host.icon("palette-bw"));
   static Colorful = new Color("Color", Host.icon("palette-cmyk"));

   constructor(title, icon) {
      this.title = title;
      this.icon = icon;
   }
   toString() {
      return this.title;
   }
}
