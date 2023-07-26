export default class ServiceEventMethod {
  static INFO = new ServiceEventMethod("info", "Info", "#0771d2" /* blue */);
  static QUOTATION = new ServiceEventMethod(
    "quotation",
    "Quotation",
    "#961d96" /* purple */,
  );
  static PURCHASE = new ServiceEventMethod(
    "purchase",
    "Purchase",
    "#258915" /* green */,
  );

  key: string;
  title: string;
  primaryColor: string;

  constructor(key: string = "", title: string = "", primaryColor: string = "") {
    this.key = key;
    this.title = title;
    this.primaryColor = primaryColor;
  }
}
