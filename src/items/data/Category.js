const Image = require("./Image.js");
const { default: U } = require("@/U.js");

class Category {
   static Key = {
      Tablet: "tablet",
      Notebook: "laptop",
      Desktop: "desktopComputer",
      Printer: "printer",
      Cartridge: "cartridge",
      Mouse: "mouse",
      Keyboard: "keyboard",
      Audio: "audio",
      Monitor: "monitor",
      Webcam: "webcam",
      Cctv: "cctv-camera",
      Storage: "storage",
      Ram: "ram",
      Network: "network",
      Charger: "charger",
      Other: "other",
   };

   static trim(data) {
      return new Category(data);
   }

   constructor(data = null) {
      this._id = U.trimId(data._id);
      this.key = U.trimId(data.key);
      this.title = U.trimStringAll(data.title);
      this.icon = U.isObject(data.icon) ? Image.trim(data.icon) : undefined;
      this.background = U.isObject(data.background)
         ? Image.trim(data.background)
         : undefined;
   }
}

module.exports = Category;
