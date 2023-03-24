const { default: U } = require("@/U");
const Text = require("./Text");

class SocketData {
   content = null;

   constructor(content = null, key = "") {
      this.content = content;

      key = U.optString(key);
      key = Text.replaceAll(key, " ", "");
      if (key.length) this.key = key;
   }
}

module.exports = SocketData;
