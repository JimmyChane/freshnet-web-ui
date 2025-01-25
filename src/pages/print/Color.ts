import IconPaletteBw from '@/assets/icon/palette-bw.svg';
import IconPaletteColor from '@/assets/icon/palette-cmyk.svg';

export default class Color {
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

export const BlackWhiteColor = new Color('Black & White', IconPaletteBw);
export const ColorfulColor = new Color('Color', IconPaletteColor);
