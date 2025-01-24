import { trimId, trimText } from '@/U';

export default class Label {
  static URGENT: Label = new Label().fromData({
    title: 'Urgent',
    hexColor: 'd93f35',
  });
  static WARRANTY: Label = new Label().fromData({
    title: 'Warranty',
    hexColor: 'db950c',
  });

  title: string = '';
  hexColor: string = '';

  fromData(data: { title: string; hexColor: string }): this {
    this.title = trimText(data.title);
    this.hexColor = trimId(data.hexColor);
    return this;
  }
  toData(): { title: string; hexColor: string } {
    return {
      title: trimText(this.title),
      hexColor: trimId(this.hexColor),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(label: Label): boolean {
    return this.title === label.title && this.hexColor === label.hexColor;
  }

  compare(item: Label): number {
    return 0;
  }
}
