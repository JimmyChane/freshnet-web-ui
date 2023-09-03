import U from "@/U";

export default class ServiceLabel {
  static URGENT: ServiceLabel = new ServiceLabel().fromData({
    title: "Urgent",
    hexColor: "d93f35",
  });
  static WARRANTY: ServiceLabel = new ServiceLabel().fromData({
    title: "Warranty",
    hexColor: "db950c",
  });

  title: string = "";
  hexColor: string = "";

  fromData(data: { title: string; hexColor: string }): this {
    this.title = U.trimText(data.title);
    this.hexColor = U.trimId(data.hexColor);
    return this;
  }
  toData(): { title: string; hexColor: string } {
    return {
      title: U.trimText(this.title),
      hexColor: U.trimId(this.hexColor),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(label: ServiceLabel): boolean {
    return this.title === label.title && this.hexColor === label.hexColor;
  }

  compare(item: ServiceLabel): number {
    return 0;
  }
}
