class Text {
   static trim(text = "", fallback = undefined) {
      text = this.parse(text).trim();
      text = this.replaceAll(text, "  ", " ");
      return text.length ? text : fallback;
   }
   static replaceAll(text = "", regex = "", replacement = "") {
      text = this.parse(text).trim();
      regex = this.parse(regex).trim();
      replacement = this.parse(replacement).trim();

      if (regex === replacement) return text;

      while (text.includes(regex)) {
         text = text.replace(regex, replacement);
      }

      return text;
   }
   static parse(text) {
      return typeof text === "string" ? text : "";
   }
}

module.exports = Text;
