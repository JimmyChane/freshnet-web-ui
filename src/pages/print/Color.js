import Host from "@/host/Server";

export default class Color {
  static BlackWhite = new Color(
    "Black & White",
    Host.icon("palette-bw").toUrl(),
  );
  static Colorful = new Color("Color", Host.icon("palette-cmyk").toUrl());

  constructor(title, icon) {
    this.title = title;
    this.icon = icon;
  }
  toString() {
    return this.title;
  }
}
