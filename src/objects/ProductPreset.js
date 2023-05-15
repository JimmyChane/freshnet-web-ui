import ProductSpecType from "@/items/ProductSpecType.js";
import Brand from "@/items/Brand";

class Brands {
   static INTEL = new Brand().fromData({ title: "Intel" });
   static AMD = new Brand().fromData({ title: "AMD" });
   static NVIDIA = new Brand().fromData({ title: "Nvidia" });
}

class Unit {
   constructor(short = "", long = "", text = "") {
      this.short = short;
      this.long = long;
      this.text = text;
   }
}

class Memory {
   static KILOBYTE = new Unit("kb", "kilobyte", "KiloByte");
   static MEGABYTE = new Unit("mb", "megabyte", "MegaByte");
   static GIGABYTE = new Unit("gb", "gigabyte", "GigaByte");
   static TERABYTE = new Unit("tb", "terabyte", "TeraByte");

   constructor(amount = 0, unit = new Unit()) {
      this.amount = amount;
      this.unit = unit;
   }

   toString() {
      return `${this.amount}${this.unit.short}`;
   }
}
class Size {
   static INCH = new Unit('"', "inch", "Inch");

   constructor(amount = 0, unit = new Unit()) {
      this.amount = amount;
      this.unit = unit;
   }

   toString() {
      return `${this.amount}${this.unit.short}`;
   }
}
class Resolution {
   constructor(width = 0, height = 0, short = "", text = "") {
      this.width = width;
      this.height = height;
      this.short = short;
      this.text = text;
   }

   toString() {
      return `${this.short}`;
   }
}

class Label {
   static PROMOTION = {
      name: "promotion",
      text: "Promotion",
      color: "#FF8A00",
   };
   static OUT_OF_STOCK = {
      name: "outOfStock",
      text: "Out of Stock",
      color: "#FF4B33",
   };
   static SECOND_HAND = {
      name: "secondHand",
      text: "Second Hand",
      color: "#249696",
   };
}

const ram = {
   ddr3: [16, 8, 7, 6, 5, 4, 3, 2].map((x) =>
      new Memory(x, Memory.GIGABYTE).toString(),
   ),
   ddr4: [16, 8, 7, 6, 5, 4, 3, 2].map((x) =>
      new Memory(x, Memory.GIGABYTE).toString(),
   ),
};
const size = [15.6, 14, 13, 13.1, 11.5].map((x) =>
   new Size(x, Size.INCH).toString(),
);
const ssd = [
   new Memory(1, Memory.TERABYTE).toString(),
   ...[1000, 512, 480, 256, 240, 128, 120].map((x) =>
      new Memory(x, Memory.GIGABYTE).toString(),
   ),
];
const hdd = [
   ...[4, 2, 1].map((x) => new Memory(x, Memory.TERABYTE).toString()),
   ...[4000, 2000, 1000, 640, 500, 320, 250].map((x) =>
      new Memory(x, Memory.GIGABYTE).toString(),
   ),
];
const resolution = [
   new Resolution(1920, 1080, "fhd", "Full HD").toString(),
   new Resolution(1366, 768, "hd", "HD").toString(),
];
const processor = {
   intel: ["i9", "i7", "i5", "i3", "celeron", "pentium"],
   amd: ["ryzen 7", "ryzen 5", "ryzen 3", "althon silver"],
};
const storage = { ssd, hdd };
const graphic = [
   `${Brands.INTEL.title} hd`,
   `${Brands.INTEL.title} uhd`,
   `${Brands.INTEL.title} iris xe`,
   `${Brands.INTEL.title} iris plus`,
   `${Brands.NVIDIA.title} geforce gtx`,
   `${Brands.NVIDIA.title} geforce rtx`,
   `${Brands.NVIDIA.title} gtx`,
   `${Brands.NVIDIA.title} rtx`,
   `${Brands.AMD.title} radeon`,
];

export default class ProductPreset {
   static Specifications = {
      processor,
      ram,
      size,
      resolution,
      display: resolution,
      storage,
      graphic,
   };
   static Colors = {
      processor: "#276EB0",
      ram: "#249696",
      size: "#3B9511",
      resolution: "#A11357",
      display: "#A11357",
      storage: "#276EB0",
   };

   static generateStockLabels(product) {
      let labels = [];

      if (product.isPricePromotion()) labels.push(Label.PROMOTION);
      if (!product.isStockAvailable()) labels.push(Label.OUT_OF_STOCK);
      if (product.isStockSecondHand()) labels.push(Label.SECOND_HAND);

      return labels;
   }
   static generateSpecificationLabels(product) {
      const { specifications } = product;

      return specifications
         .filter((itemSpec) => {
            return Object.keys(this.Specifications).includes(
               itemSpec?.type?.key,
            );
         })
         .map((itemSpec) => {
            const compares = this.Specifications[itemSpec.type.key];
            const content = itemSpec.content.toLowerCase();

            if (
               itemSpec.type.key === ProductSpecType.Key.Processor ||
               itemSpec.type.key === ProductSpecType.Key.Ram ||
               itemSpec.type.key === ProductSpecType.Key.Storage
            ) {
               for (const compareType of Object.keys(compares)) {
                  if (!content.includes(compareType)) {
                     continue;
                  }
                  for (const compare of compares[compareType]) {
                     if (content.includes(compare)) {
                        return {
                           name: `${compareType}${compare}`,
                           text: `${compareType} ${compare}`.toUpperCase(),
                           color: this.Colors[itemSpec.type.key],
                        };
                     }
                  }
               }
            }

            if (itemSpec.type.key === ProductSpecType.Key.Size) {
               for (const compare of compares) {
                  if (content.includes(compare)) {
                     return {
                        name: compare,
                        text: `${compare}"`,
                        color: this.Colors[itemSpec.type.key],
                     };
                  }
               }
            } else if (
               itemSpec.type.key === ProductSpecType.Key.Resolution ||
               itemSpec.type.key === ProductSpecType.Key.Display
            ) {
               for (const compare of compares) {
                  if (content.includes(compare)) {
                     return {
                        name: compare,
                        text: `${compare}`.toUpperCase(),
                        color: this.Colors[itemSpec.type.key],
                     };
                  }
               }
            }

            if (itemSpec.type.key === ProductSpecType.Key.Graphic) {
               for (const compare of compares
                  .map((compare) => compare)
                  .reverse()) {
                  if (content.includes(compare)) {
                     return {
                        name: compare,
                        text: `${compare}`.toUpperCase(),
                        color: this.Colors[itemSpec.type.key],
                     };
                  }
               }
            }
         })
         .filter((itemSpec) => itemSpec);
   }

   constructor() {
      throw new Error("not supported");
   }
}
