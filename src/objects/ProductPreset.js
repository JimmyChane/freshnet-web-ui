import ProductSpecType from "@/items/ProductSpecType.js";
import Brand from "@/items/Brand";
class Brands {
    static INTEL = new Brand(null).fromData({
        _id: "",
        title: "Intel",
        icon: null,
    });
    static AMD = new Brand(null).fromData({ _id: "", title: "AMD", icon: null });
    static NVIDIA = new Brand(null).fromData({
        _id: "",
        title: "Nvidia",
        icon: null,
    });
}
class Unit {
    short;
    long;
    text;
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
    amount;
    unit;
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
    amount;
    unit;
    constructor(amount = 0, unit = new Unit()) {
        this.amount = amount;
        this.unit = unit;
    }
    toString() {
        return `${this.amount}${this.unit.short}`;
    }
}
class Resolution {
    width;
    height;
    short;
    text;
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
    static PROMOTION = new Label("promotion", "Promotion", "#FF8A00");
    static OUT_OF_STOCK = new Label("outOfStock", "Out of Stock", "#FF4B33");
    static SECOND_HAND = new Label("secondHand", "Second Hand", "#249696");
    name;
    text;
    color;
    constructor(name, text, color) {
        this.name = name;
        this.text = text;
        this.color = color;
    }
}
const ram = {
    ddr3: [16, 8, 7, 6, 5, 4, 3, 2].map((x) => {
        return new Memory(x, Memory.GIGABYTE).toString();
    }),
    ddr4: [16, 8, 7, 6, 5, 4, 3, 2].map((x) => {
        return new Memory(x, Memory.GIGABYTE).toString();
    }),
};
const size = [15.6, 14, 13, 13.1, 11.5].map((x) => {
    return new Size(x, Size.INCH).toString();
});
const ssd = [
    new Memory(1, Memory.TERABYTE).toString(),
    ...[1000, 512, 480, 256, 240, 128, 120].map((x) => {
        return new Memory(x, Memory.GIGABYTE).toString();
    }),
];
const hdd = [
    ...[4, 2, 1].map((x) => new Memory(x, Memory.TERABYTE).toString()),
    ...[4000, 2000, 1000, 640, 500, 320, 250].map((x) => {
        return new Memory(x, Memory.GIGABYTE).toString();
    }),
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
        if (product.isPricePromotion())
            labels.push(Label.PROMOTION);
        if (!product.isStockAvailable())
            labels.push(Label.OUT_OF_STOCK);
        if (product.isStockSecondHand())
            labels.push(Label.SECOND_HAND);
        return labels;
    }
    static generateSpecificationLabels(product) {
        const { specifications } = product;
        return specifications
            .filter((itemSpec) => {
            const key = itemSpec.getKey();
            return Object.keys(ProductPreset.Specifications).includes(key);
        })
            .map((itemSpec) => {
            const key = itemSpec.getKey();
            const compares = ProductPreset.Specifications[key];
            const content = itemSpec.content.toLowerCase();
            if (key === ProductSpecType.Key.Processor ||
                key === ProductSpecType.Key.Ram ||
                key === ProductSpecType.Key.Storage) {
                for (const compareType of Object.keys(compares)) {
                    if (!content.includes(compareType)) {
                        continue;
                    }
                    for (const compare of compares[compareType]) {
                        if (content.includes(compare)) {
                            return {
                                name: `${compareType}${compare}`,
                                text: `${compareType} ${compare}`.toUpperCase(),
                                color: ProductPreset.Colors[key],
                            };
                        }
                    }
                }
            }
            if (key === ProductSpecType.Key.Size) {
                for (const compare of compares) {
                    if (content.includes(compare)) {
                        return {
                            name: compare,
                            text: `${compare}"`,
                            color: this.Colors[key],
                        };
                    }
                }
            }
            else if (key === ProductSpecType.Key.Resolution ||
                key === ProductSpecType.Key.Display) {
                for (const compare of compares) {
                    if (content.includes(compare)) {
                        return {
                            name: compare,
                            text: `${compare}`.toUpperCase(),
                            color: this.Colors[key],
                        };
                    }
                }
            }
            if (key === ProductSpecType.Key.Graphic) {
                const reversedCompares = compares
                    .map((compare) => compare)
                    .reverse();
                for (const compare of reversedCompares) {
                    if (content.includes(compare)) {
                        return {
                            name: compare,
                            text: `${compare}`.toUpperCase(),
                            color: this.Colors[key],
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
