const Text = require("./Text.js");
const Image = require("./Image.js");

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
      this._id = Text.trim(data._id, data._id);
      this.key = Text.trim(data.key, "").replace(" ", "");
      this.title = Text.trim(data.title, "");
      this.icon = typeof data.icon === "object" ? Image.trim(data.icon) : undefined;
      this.background =
         typeof data.background === "object" ? Image.trim(data.background) : undefined;
   }
}

module.exports = Category;
