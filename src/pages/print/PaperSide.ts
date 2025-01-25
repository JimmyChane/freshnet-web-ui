import IconPaper1 from '@/assets/icon/paper-1sided.svg';
import IconPaper2 from '@/assets/icon/paper-2sided.svg';
import IconPaperA4Ic1 from '@/assets/icon/paper-a4-1sided-ic.svg';

export default class PaperSide {
  title: string;
  icon: string;

  constructor(title: string, icon: string) {
    this.title = title;
    this.icon = icon;
  }
}

export const FrontPaperSide = new PaperSide('1 Side', IconPaper1);
export const FrontBackPaperSide = new PaperSide('2 Side', IconPaper2);
export const FrontIcPaperSide = new PaperSide(
  '1 Side IC Full Copy',
  IconPaperA4Ic1,
);
