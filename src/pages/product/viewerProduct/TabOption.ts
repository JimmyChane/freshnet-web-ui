export default abstract class Tab {
  key: string;
  title: string;

  constructor(key: string, title: string) {
    this.key = key;
    this.title = title;
  }

  abstract isSelected(tab: Tab): boolean;
}
