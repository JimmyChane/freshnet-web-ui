import chroma from "chroma-js";

export default class U {
  static isString(str: any): boolean {
    return typeof str === "string";
  }
  static isNumber(num: any): boolean {
    return typeof num === "number" && !Number.isNaN(num);
  }
  static isBoolean(bool: any): boolean {
    return typeof bool === "boolean";
  }
  static isArray(arr: any): boolean {
    return Array.isArray(arr);
  }
  static isObject(obj: any): boolean {
    return typeof obj === "object";
  }
  static isObjectOnly(obj: any): boolean {
    return this.isObject(obj) && obj;
  }
  static isFunction(fun: any): boolean {
    return typeof fun === "function";
  }

  static optString(str: any, fallback = ""): string {
    return this.isString(str) ? str : fallback;
  }
  static optNumber(num: any, fallback = 0): number {
    return this.isNumber(num) ? num : fallback;
  }
  static optBoolean(bool: any, fallback = false): boolean {
    return this.isBoolean(bool) ? bool : fallback;
  }
  static optArray(arr: any, fallback = []): [] {
    return this.isArray(arr) ? arr : fallback;
  }
  static optObject(obj: any, fallback = {}): {} {
    return this.isObject(obj) ? obj : fallback;
  }
  static optObjectOnly(obj: any, fallback = {}): {} {
    return this.isObjectOnly(obj) ? obj : fallback;
  }

  static trimId(str: any): string {
    return this.replaceStringAll(str, " ", "");
  }
  static trimText(str: any): string {
    return this.replaceStringAll(str, "  ", " ").trim();
  }
  static trimStringAll(str = "", fallback = ""): string {
    str = this.trimText(str);
    return str.length ? str : fallback;
  }
  static replaceStringAll(str = "", regex = "", replace = ""): string {
    str = U.optString(str);
    regex = U.optString(regex);
    replace = U.optString(replace);

    if (regex === replace) return str;

    while (str.includes(regex)) {
      str = str.replace(regex, replace);
    }

    return str;
  }

  static isColorDark(color: any, threshold = 60): boolean {
    return chroma.deltaE(color, "000000") < threshold;
  }
}
