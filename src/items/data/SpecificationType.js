const Image = require("./Image.js");
const { default: U } = require("@/U.js");

class SpecificationType {
   static Key = {
      Processor: "processor",
      Ram: "ram",
      Size: "size",
      Storage: "storage",
      Resolution: "resolution",
      Display: "display",
      Monitor: "monitor",
      Graphic: "graphic",

      Keyboard: "keyboard",
      Backlight: "backlight",
      Stylus: "stylus",
      Camera: "camera",
      Battery: "battery",

      Speed: "speed",
      Wifi: "wifi",
      Bluetooth: "bluetooth",

      Print: "print",
      Scan: "scan",
      Paper: "paper",
      Ink: "ink",
      Connectivity: "connectivity",

      Colour: "colour",
      Os: "os",
   };

   static trim(data) {
      return new SpecificationType(data);
   }

   constructor(data = null) {
      this.key = U.trimId(data.key);
      this.title = U.trimText(data.title);
      this.icon = U.isObjectOnly(data.icon) ? Image.trim(data.icon) : undefined;
      this.color = U.trimId(data.color);
   }
}

module.exports = SpecificationType;
