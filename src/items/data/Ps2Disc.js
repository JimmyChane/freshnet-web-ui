const { default: U } = require("@/U.js");

class Ps2Disc {
   static trim(data) {
      return new Ps2Disc(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.code = U.trimId(data.code);
      this.title = U.trimText(data.title);
   }
}

module.exports = Ps2Disc;
