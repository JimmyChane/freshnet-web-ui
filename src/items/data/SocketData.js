const parse = (text) => {
   return typeof text === "string" ? text : "";
};
const replaceAll = (text = "", regex = "", replacement = "") => {
   text = parse(text).trim();
   regex = parse(regex).trim();
   replacement = parse(replacement).trim();

   if (regex === replacement) return text;

   while (text.includes(regex)) {
      text = text.replace(regex, replacement);
   }

   return text;
};

class SocketData {
   content = null;

   constructor(content = null, key = "") {
      this.content = content;

      if (typeof key !== "string") key = "";
      key = key ? replaceAll(key, " ", "") : "";
      if (key.length) this.key = key;
   }
}

module.exports = SocketData;
