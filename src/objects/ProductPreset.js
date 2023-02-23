import ProductSpecType from "@/items/ProductSpecType.js";
import Brand from "@/items/Brand";

class Brands {
   static Intel = new Brand().fromData({ title: "Intel" });
   static Amd = new Brand().fromData({ title: "AMD" });
   static Nvidia = new Brand().fromData({ title: "Nvidia" });
}

class Unit {
   constructor(short = "", long = "", text = "") {
      this.short = short;
      this.long = long;
      this.text = text;
   }
}

class Memory {
   static Unit = {
      Kilobyte: new Unit("kb", "kilobyte", "KiloByte"),
      Megabyte: new Unit("mb", "megabyte", "MegaByte"),
      Gigabyte: new Unit("gb", "gigabyte", "GigaByte"),
      Terabyte: new Unit("tb", "terabyte", "TeraByte"),
   };

   constructor(amount = 0, unit = new Unit()) {
      this.amount = amount;
      this.unit = unit;
   }

   toString() {
      return `${this.amount}${this.unit.short}`;
   }
}
class Size {
   static Unit = { Inch: new Unit('"', "inch", "Inch") };

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

const Labels = {
   Promotion: { name: "promotion", text: "Promotion", color: "#FF8A00" },
   OutOfStock: { name: "outOfStock", text: "Out of Stock", color: "#FF4B33" },
   SecondHand: { name: "secondHand", text: "Second Hand", color: "#249696" },
};

const ram = {
   ddr3: [16, 8, 7, 6, 5, 4, 3, 2].map((x) =>
      new Memory(x, Memory.Unit.Gigabyte).toString(),
   ),
   ddr4: [16, 8, 7, 6, 5, 4, 3, 2].map((x) =>
      new Memory(x, Memory.Unit.Gigabyte).toString(),
   ),
};
const size = [15.6, 14, 13, 13.1, 11.5].map((x) =>
   new Size(x, Size.Unit.Inch).toString(),
);
const ssd = [
   new Memory(1, Memory.Unit.Terabyte).toString(),
   ...[1000, 512, 480, 256, 240, 128, 120].map((x) =>
      new Memory(x, Memory.Unit.Gigabyte).toString(),
   ),
];
const hdd = [
   ...[4, 2, 1].map((x) => new Memory(x, Memory.Unit.Terabyte).toString()),
   ...[4000, 2000, 1000, 640, 500, 320, 250].map((x) =>
      new Memory(x, Memory.Unit.Gigabyte).toString(),
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
   `${Brands.Intel.title} hd`,
   `${Brands.Intel.title} uhd`,
   `${Brands.Intel.title} iris xe`,
   `${Brands.Intel.title} iris plus`,
   `${Brands.Nvidia.title} geforce gtx`,
   `${Brands.Nvidia.title} geforce rtx`,
   `${Brands.Nvidia.title} gtx`,
   `${Brands.Nvidia.title} rtx`,
   `${Brands.Amd.title} radeon`,
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

      if (product.isPricePromotion()) labels.push(Labels.Promotion);
      if (!product.isStockAvailable()) labels.push(Labels.OutOfStock);
      if (product.isStockSecondHand()) labels.push(Labels.SecondHand);

      return labels;
   }
   static generateSpecificationLabels(product) {
      const { specifications } = product;

      return specifications
         .filter((itemSpec) => {
            return Object.keys(this.Specifications).includes(itemSpec?.type?.key);
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
               for (const compare of compares.map((compare) => compare).reverse()) {
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
