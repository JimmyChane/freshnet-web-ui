const Text = require("./Text.js");

class Ps2Disc {
   static trim(data) {
      return new Ps2Disc(data);
   }

   constructor(data = null) {
      this._id = Text.trim(data._id, data._id);
      this.code = Text.trim(data.code, "").replace(" ", "");
      this.title = Text.trim(data.title, "");
   }
}

module.exports = Ps2Disc;
