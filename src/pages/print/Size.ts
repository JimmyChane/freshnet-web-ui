export default class Size {
  width: string;
  height: string;

  constructor(width: string, height: string) {
    this.width = width;
    this.height = height;
  }
  toString(): string {
    return `${this.width} x ${this.height}`;
  }
}
