export default class PaperType {
  static readonly Plain = new PaperType("Plain Paper");
  static readonly Photo = new PaperType("Photo Paper");

  title: string;
  icon?: string;

  constructor(title: string, icon?: string) {
    this.title = title;
    this.icon = icon;
  }
}
