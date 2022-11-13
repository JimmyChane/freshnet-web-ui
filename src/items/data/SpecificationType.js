const Text = require("./Text.js");
const Image = require("./Image.js");

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
      this.key = Text.trim(data.key, "").replace(" ", "");
      this.title = Text.trim(data.title, "");
      this.icon =
         typeof data.icon === "object" && data.icon
            ? Image.trim(data.icon)
            : undefined;
      this.color = Text.trim(data.color, "").replace(" ", "");
   }
}

module.exports = SpecificationType;
