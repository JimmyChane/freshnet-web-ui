class PhoneNumber {
   static #parseString(value, fallback = "") {
      return typeof value === "string" ? value : fallback;
   }
   static #spliceString(text, index, count = 1) {
      if (count <= 0) return text;
      if (index === 0) return text.slice(index + count, text.length);
      if (text.length <= index + count) return text.slice(0, index);
      return text.slice(0, index) + text.slice(index + count, text.length);
   }
   static #parsePhoneNumber(value) {
      value = this.#parseString(value);

      for (let i = 0; i < value.length; i++) {
         let char = value.charAt(i);
         let number = Number.parseInt(char);
         if (Number.isNaN(number)) {
            value = this.#spliceString(value, i);
            i--;
         }
      }

      return value;
   }

   static parseToString(value) {
      return this.#parsePhoneNumber(value);
   }
}

module.exports = PhoneNumber;
