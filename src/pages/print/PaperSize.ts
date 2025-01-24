import IconPaperA3 from '@/assets/icon/paper-a3.svg';
import IconPaperA4 from '@/assets/icon/paper-a4.svg';

import Size from './Size';

export default class PaperSize {
  static readonly _4R = new PaperSize(
    '4R',
    IconPaperA4,
    new Size('10.2cm', '15.2cm'),
  );
  static readonly A4 = new PaperSize(
    'A4',
    IconPaperA4,
    new Size('210mm', '297mm'),
  );
  static readonly A3 = new PaperSize(
    'A3',
    IconPaperA3,
    new Size('297mm', '420mm'),
  );

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
