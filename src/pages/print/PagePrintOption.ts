import Output from "./Output";
import Paper from "./Paper";
import PaperSize from "./PaperSize";
import Price from "@/objects/Price";

export class Media {
  title: string;
  items: Category[];

  constructor(title: string = "", items: Category[] = []) {
    this.title = title;
    this.items = items;
  }
}
export class Category {
  title: string;
  icon: string;
  items: Item[];

  constructor(res: Paper, items: Item[]) {
    this.title = res ? res.toString() : "";
    this.icon = res ? res.paperType.icon ?? "" : "";
    this.items = items;
  }
}
export class SubCategory {
  title: string;
  icon: string;
  items: Item[];

  constructor(res: Output, items: Item[]) {
    this.title = res ? res.toString() : "";
    this.icon = res ? res.color.icon : "";
    this.items = items;
  }
}
export class Item {
  title: string;
  icon: string;
  price: Price;

  constructor(res: PaperSize, price: Price) {
    this.title = res ? res.title : "";
    this.icon = res ? res.icon : "";
    this.price = price;
  }
}
