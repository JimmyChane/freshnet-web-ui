import chroma from "chroma-js";

class U {
   static isString(str) {
      return typeof str === "string";
   }
   static isNumber(num) {
      return typeof num === "number" && !Number.isNaN(num);
   }
   static isBoolean(bool) {
      return typeof bool === "boolean";
   }
   static isArray(arr) {
      return Array.isArray(arr);
   }
   static isObject(obj) {
      return typeof obj === "object";
   }
   static isObjectOnly(obj) {
      return this.isObject(obj) && obj;
   }

   static optString(str, fallback = "") {
      return this.isString(str) ? str : fallback;
   }
   static optNumber(num, fallback = 0) {
      return this.isNumber(num) ? num : fallback;
   }
   static optBoolean(bool, fallback = false) {
      return this.isBoolean(bool) ? bool : fallback;
   }
   static optArray(arr, fallback = []) {
      return this.isArray(arr) ? arr : fallback;
   }
   static optObject(obj, fallback = {}) {
      return this.isObject(obj) ? obj : fallback;
   }
   static optObjectOnly(obj, fallback = {}) {
      return this.isObjectOnly(obj) ? obj : fallback;
   }

   static trimId(str) {
      return this.replaceStringAll(str, " ", "");
   }
   static trimText(str) {
      return this.replaceStringAll(str, "  ", " ").trim();
   }
   static trimStringAll(str = "", fallback = "") {
      str = this.trimText(str);
      return str.length ? str : fallback;
   }
   static replaceStringAll(str = "", regex = "", replace = "") {
      str = U.optString(str);
      regex = U.optString(regex);
      replace = U.optString(replace);

      if (regex === replace) return str;

      while (str.includes(regex)) {
         str = str.replace(regex, replace);
      }

      return str;
   }

   static isColorDark(color, threshold = 60) {
      return chroma.deltaE(color, "000000") < threshold;
   }
}

export default U;
