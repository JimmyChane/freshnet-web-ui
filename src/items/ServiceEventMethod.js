const BLUE = "#0771d2";
const PURPLE = "#961d96";
const GREEN = "#258915";
export default class ServiceEventMethod {
    static INITIAL = new ServiceEventMethod("initial", "Initial", BLUE);
    static INFO = new ServiceEventMethod("info", "Info", BLUE);
    static QUOTATION = new ServiceEventMethod("quotation", "Quotation", PURPLE);
    static PURCHASE = new ServiceEventMethod("purchase", "Purchase", GREEN);
    key;
    title;
    primaryColor;
    constructor(key = "", title = "", primaryColor = "") {
        this.key = key;
        this.title = title;
        this.primaryColor = primaryColor;
    }
}
