import ProductSpecType from "@/items/ProductSpecType.js";

const Labels = {
	Promotion: { name: "promotion", text: "Promotion", color: "#FF8A00" },
	OutOfStock: { name: "outOfStock", text: "Out of Stock", color: "#FF4B33" },
	SecondHand: { name: "secondHand", text: "Second Hand", color: "#249696" },
};

export default class ProductPreset {
	static Specifications = {
		processor: {
			intel: ["i9", "i7", "i5", "i3", "celeron", "pentium"],
			amd: ["ryzen 7", "ryzen 5", "ryzen 3", "althon silver"],
		},
		ram: {
			ddr3: ["16gb", "8gb", "7gb", "6gb", "5gb", "4gb", "3gb", "2gb"],
			ddr4: ["16gb", "8gb", "7gb", "6gb", "5gb", "4gb", "3gb", "2gb"],
		},
		size: ["15.6", "14", "13", "13.1", "11.5"],
		resolution: ["full hd", "fhd", "hd"],
		display: ["full hd", "fhd", "hd"],
		storage: {
			ssd: [
				"1tb",
				"1000gb",
				"512gb",
				"480gb",
				"256gb",
				"240gb",
				"128gb",
				"120gb",
			],
			hdd: [
				"4tb",
				"4000gb",
				"2tb",
				"2000gb",
				"1tb",
				"1000gb",
				"640gb",
				"500gb",
				"320gb",
				"250gb",
			],
		},
		graphic: [
			"intel hd",
			"intel uhd",
			"intel iris xe",
			"intel iris plus",
			"nvidia geforce gtx",
			"nvidia geforce rtx",
			"nvidia gtx",
			"nvidia rtx",
			"amd radeon",
		],
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
