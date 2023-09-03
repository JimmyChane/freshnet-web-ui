import IconPaletteColor from "@/assets/icon/palette-cmyk.svg";
import IconPaletteBw from "@/assets/icon/palette-bw.svg";

export default class Color {
  static BlackWhite = new Color("Black & White", IconPaletteBw);
  static Colorful = new Color("Color", IconPaletteColor);

  title: string;
  icon: string;

  constructor(title: string, icon: string) {
    this.title = title;
    this.icon = icon;
  }
  toString() {
    return this.title;
  }
}
