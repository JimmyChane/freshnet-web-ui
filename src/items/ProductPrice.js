const Currency = "RM";
const charSpace = " ";
const charDot = ".";

const parseCurrency = (content) => {
	const indexStart = content.indexOf(Currency);
	const indexEnd = indexStart === -1 ? -1 : indexStart + Currency.length;
	return {
		indexStart,
		indexEnd,
		value: indexStart === -1 ? "" : content.substring(indexStart, indexEnd),
	};
};
const parseAmount = (content) => {
	let valueString = "";
	let hasNumberFront = false;
	let hasNumberBack = false;
	let hasDot = false;
	for (let i = 0; i < content.length; i++) {
		let char = content.charAt(i);

		if (char === charSpace) {
			if (hasDot || hasNumberFront || hasNumberBack) break;
			continue;
		}

		let parse = Number.parseInt(char);
		if (!Number.isNaN(parse)) {
			valueString += parse;
			if (hasDot) hasNumberBack = true;
			else hasNumberFront = true;
			continue;
		}

		if (char === charDot) {
			if (hasDot) break;
			valueString += ".";
			hasDot = true;
			continue;
		}
	}

	const valueParse = Number.parseFloat(valueString);

	return Number.isNaN(valueParse) ? 0 : valueParse;
};

class ProductPrice {
	static Currency = Currency;

	static parseString(content) {
		const currencyParses = [];
		const amountParsed = parseAmount(content);

		while (true) {
			let currencyParsed = parseCurrency(content);
			if (!currencyParsed.value) break;
			currencyParses.push(currencyParsed);
			content = content.substring(currencyParsed.indexEnd, content.length);
		}

		return new ProductPrice().fromData({
			currency: currencyParses.length ? currencyParses[0].value : "",
			value: amountParsed,
		});
	}

	currency = "";
	value = 0;

	constructor(data) {
		this.fromData(data);
	}

	fromData(data = { currency: "", value: 0 }) {
		this.currency = data.currency;
		this.value = data.value;
		return this;
	}
	toData() {
		return { currency: this.currency, value: this.value };
	}
	toString() {
		let { currency, value } = this;

		if (typeof value !== "number") value = 0;

		let valueString = value.toFixed(2);

		let index = valueString.indexOf(".");
		if (index >= 4) {
			valueString =
				valueString.substring(0, index - 3) +
				"," +
				valueString.substring(index - 3, valueString.length);
		}

		if (!currency) return `${ProductPrice.Currency} ${valueString}`;

		return `${currency} ${valueString}`;
	}
	toCount(strs) {
		return 0;
	}

	compare(item) {
		return 0;
	}
}

export default ProductPrice;
