import { Brand } from '@/items/Brand';
import { Product } from '@/items/Product';
import { Specification, SpecificationKey } from '@/items/Specification';

export const INTEL_BRAND = new Brand(null).fromData({
  _id: '',
  title: 'Intel',
  icon: null,
});
export const AMD_BRAND = new Brand(null).fromData({
  _id: '',
  title: 'AMD',
  icon: null,
});
export const NVIDIA_BRAND = new Brand(null).fromData({
  _id: '',
  title: 'Nvidia',
  icon: null,
});

class Unit {
  short: string;
  long: string;
  text: string;

  constructor(short: string = '', long: string = '', text: string = '') {
    this.short = short;
    this.long = long;
    this.text = text;
  }
}

class Memory {
  amount: number;
  unit: Unit;

  constructor(amount: number = 0, unit: Unit = new Unit()) {
    this.amount = amount;
    this.unit = unit;
  }

  toString(): string {
    return `${this.amount}${this.unit.short}`;
  }
}

export const KILOBYTE_MEMORY = new Unit('kb', 'kilobyte', 'KiloByte');
export const MEGABYTE_MEMORY = new Unit('mb', 'megabyte', 'MegaByte');
export const GIGABYTE_MEMORY = new Unit('gb', 'gigabyte', 'GigaByte');
export const TERABYTE_MEMORY = new Unit('tb', 'terabyte', 'TeraByte');

class Size {
  amount: number;
  unit: Unit;

  constructor(amount: number = 0, unit: Unit = new Unit()) {
    this.amount = amount;
    this.unit = unit;
  }

  toString(): string {
    return `${this.amount}${this.unit.short}`;
  }
}

export const INCH_UNIT = new Unit('"', 'inch', 'Inch');

class Resolution {
  width: number;
  height: number;
  short: string;
  text: string;

  constructor(
    width: number = 0,
    height: number = 0,
    short: string = '',
    text: string = '',
  ) {
    this.width = width;
    this.height = height;
    this.short = short;
    this.text = text;
  }

  toString(): string {
    return `${this.short}`;
  }
}

class Label {
  name: string;
  text: string;
  color: string;

  constructor(name: string, text: string, color: string) {
    this.name = name;
    this.text = text;
    this.color = color;
  }
}

export const PROMOTION_LABEL = new Label('promotion', 'Promotion', '#FF8A00');
export const OUT_OF_STOCK_LABEL = new Label(
  'outOfStock',
  'Out of Stock',
  '#FF4B33',
);
export const SECOND_HAND_LABEL = new Label(
  'secondHand',
  'Second Hand',
  '#249696',
);

const ram = {
  ddr3: [16, 8, 7, 6, 5, 4, 3, 2].map((x) => {
    return new Memory(x, GIGABYTE_MEMORY).toString();
  }),
  ddr4: [16, 8, 7, 6, 5, 4, 3, 2].map((x) => {
    return new Memory(x, GIGABYTE_MEMORY).toString();
  }),
};
const size = [15.6, 14, 13, 13.1, 11.5].map((x) => {
  return new Size(x, INCH_UNIT).toString();
});
const ssd = [
  new Memory(1, TERABYTE_MEMORY).toString(),
  ...[1000, 512, 480, 256, 240, 128, 120].map((x) => {
    return new Memory(x, GIGABYTE_MEMORY).toString();
  }),
];
const hdd = [
  ...[4, 2, 1].map((x) => new Memory(x, TERABYTE_MEMORY).toString()),
  ...[4000, 2000, 1000, 640, 500, 320, 250].map((x) => {
    return new Memory(x, GIGABYTE_MEMORY).toString();
  }),
];
const resolution = [
  new Resolution(1920, 1080, 'fhd', 'Full HD').toString(),
  new Resolution(1366, 768, 'hd', 'HD').toString(),
];
const processor = {
  intel: ['i9', 'i7', 'i5', 'i3', 'celeron', 'pentium'],
  amd: ['ryzen 7', 'ryzen 5', 'ryzen 3', 'althon silver'],
};
const storage = { ssd, hdd };
const graphic = [
  `${INTEL_BRAND.title} hd`,
  `${INTEL_BRAND.title} uhd`,
  `${INTEL_BRAND.title} iris xe`,
  `${INTEL_BRAND.title} iris plus`,
  `${NVIDIA_BRAND.title} geforce gtx`,
  `${NVIDIA_BRAND.title} geforce rtx`,
  `${NVIDIA_BRAND.title} gtx`,
  `${NVIDIA_BRAND.title} rtx`,
  `${AMD_BRAND.title} radeon`,
];

export const SpecificationsPreset: Record<string, any> = {
  processor,
  ram,
  size,
  resolution,
  display: resolution,
  storage,
  graphic,
};
export const ColorsPreset: Record<string, any> = {
  processor: '#276EB0',
  ram: '#249696',
  size: '#3B9511',
  resolution: '#A11357',
  display: '#A11357',
  storage: '#276EB0',
};

export function generateStockLabels(product: Product) {
  let labels = [];

  if (product.isPricePromotion()) labels.push(PROMOTION_LABEL);
  if (!product.isStockAvailable()) labels.push(OUT_OF_STOCK_LABEL);
  if (product.isStockSecondHand()) labels.push(SECOND_HAND_LABEL);

  return labels;
}
export function generateSpecificationLabels(product: Product) {
  const { specifications } = product;

  return specifications
    .filter((itemSpec: Specification) => {
      const key = itemSpec.getKey();
      return Object.keys(SpecificationsPreset).includes(key);
    })
    .map((itemSpec) => {
      const key = itemSpec.getKey();
      const compares = SpecificationsPreset[key];
      const content = itemSpec.content.toLowerCase();

      if (
        key === SpecificationKey.Processor ||
        key === SpecificationKey.Ram ||
        key === SpecificationKey.Storage
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
                color: ColorsPreset[key],
              };
            }
          }
        }
      }

      if (key === SpecificationKey.Size) {
        for (const compare of compares) {
          if (content.includes(compare)) {
            return {
              name: compare,
              text: `${compare}"`,
              color: ColorsPreset[key],
            };
          }
        }
      } else if (
        key === SpecificationKey.Resolution ||
        key === SpecificationKey.Display
      ) {
        for (const compare of compares) {
          if (content.includes(compare)) {
            return {
              name: compare,
              text: `${compare}`.toUpperCase(),
              color: ColorsPreset[key],
            };
          }
        }
      }

      if (key === SpecificationKey.Graphic) {
        const reversedCompares = compares
          .map((compare: any) => compare)
          .reverse();
        for (const compare of reversedCompares) {
          if (content.includes(compare)) {
            return {
              name: compare,
              text: `${compare}`.toUpperCase(),
              color: ColorsPreset[key],
            };
          }
        }
      }
    })
    .filter((itemSpec) => itemSpec);
}
