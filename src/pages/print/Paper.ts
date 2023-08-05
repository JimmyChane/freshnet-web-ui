import PaperType from "./PaperType";
import PaperSize from "./PaperSize";

export default class Paper {
  static readonly Photo4R = new Paper(PaperType.Photo, PaperSize._4R);
  static readonly PhotoA4 = new Paper(PaperType.Photo, PaperSize.A4);

  static readonly PlainA4 = new Paper(PaperType.Plain, PaperSize.A4);
  static readonly PlainA3 = new Paper(PaperType.Plain, PaperSize.A3);

  paperType: PaperType;
  paperSize: PaperSize;

  constructor(paperType: PaperType, paperSize: PaperSize) {
    this.paperType = paperType;
    this.paperSize = paperSize;
  }

  toString(): string {
    return `${this.paperType.title} ${this.paperSize.title}`;
  }
}
