import IconPaletteBw from '@/assets/icon/palette-bw.svg';
import IconPaletteColor from '@/assets/icon/palette-cmyk.svg';

export default class Color {
  static BlackWhite = new Color('Black & White', IconPaletteBw);
  static Colorful = new Color('Color', IconPaletteColor);

  title: any;
  icon: any;

  constructor(title: any, icon: any) {
    this.title = title;
    this.icon = icon;
  }
  toString() {
    return this.title;
  }
}
