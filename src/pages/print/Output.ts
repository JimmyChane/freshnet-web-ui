import { BlackWhiteColor, ColorfulColor } from './Color';

export class Output {
  title: any;
  color: any;

  constructor(title: any, color: any) {
    this.title = title;
    this.color = color;
  }

  toString() {
    if (!this.title) return `${this.color.title}`;
    return `${this.color.title} ${this.title}`;
  }
}

export const BlackWhiteOutput = new Output('', BlackWhiteColor);
export const ColorfulOutput = new Output('', ColorfulColor);
export const BorderlessColorfulOutput = new Output('Borderless', ColorfulColor);
