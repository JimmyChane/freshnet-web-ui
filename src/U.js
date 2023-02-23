import chroma from "chroma-js";

export default {
   isString(str) {
      return typeof str === "string";
   },
   isNumber(num) {
      return typeof num === "number";
   },
   isObject(obj) {
      return typeof obj === "object";
   },
   isArray(arr) {
      return Array.isArray(arr);
   },

   optString(str) {
      return this.isString(str) ? str : "";
   },
   optNumber(num) {
      return this.isNumber(num) ? num : 0;
   },
   optArray(arr) {
      return this.isArray(arr) ? arr : [];
   },
   optObject(obj) {
      return this.isObject(obj) ? obj : {};
   },

   isColorDark(color, thre = 60) {
      return chroma.deltaE(color, "000000") < thre;
   },
};
