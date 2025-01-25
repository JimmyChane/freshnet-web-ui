import PaperSize, {
  A3PaperSize,
  A4PaperSize,
  FourRPaperSize,
} from './PaperSize';
import PaperType, { PhotoPaperType, PlainPaperType } from './PaperType';

export default class Paper {
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

export const Photo4RPaper = new Paper(PhotoPaperType, FourRPaperSize);
export const PhotoA4Paper = new Paper(PhotoPaperType, A4PaperSize);

export const PlainA4Paper = new Paper(PlainPaperType, A4PaperSize);
export const PlainA3Paper = new Paper(PlainPaperType, A3PaperSize);
