import IconPaperA3 from '@/assets/icon/paper-a3.svg';
import IconPaperA4 from '@/assets/icon/paper-a4.svg';

import { Size } from './Size';

export class PaperSize {
  title: string;
  icon: string;
  size: Size;

  constructor(title: string, icon: string, size: Size) {
    this.title = title;
    this.icon = icon;
    this.size = size;
  }

  get width() {
    return this.size.width;
  }
  get height() {
    return this.size.height;
  }
  toString() {
    return this.size.toString();
  }
}

export const FourRPaperSize = new PaperSize(
  '4R',
  IconPaperA4,
  new Size('10.2cm', '15.2cm'),
);
export const A4PaperSize = new PaperSize(
  'A4',
  IconPaperA4,
  new Size('210mm', '297mm'),
);
export const A3PaperSize = new PaperSize(
  'A3',
  IconPaperA3,
  new Size('297mm', '420mm'),
);
