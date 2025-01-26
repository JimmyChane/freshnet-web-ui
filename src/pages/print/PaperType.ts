export class PaperType {
  title: string;
  icon?: string;

  constructor(title: string, icon?: string) {
    this.title = title;
    this.icon = icon;
  }
}

export const PlainPaperType = new PaperType('Plain Paper');
export const PhotoPaperType = new PaperType('Photo Paper');
