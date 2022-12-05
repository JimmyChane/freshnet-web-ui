export default class Price {
	static #parseCurrency(content) {
		const indexStart = content.indexOf(this.DefaultCurrency);
		const indexEnd =
			indexStart === -1 ? -1 : indexStart + this.DefaultCurrency.length;
		return {
			indexStart,
			indexEnd,
			value: indexStart === -1 ? "" : content.substring(indexStart, indexEnd),
		};
	}
	static #parseAmount(content) {
		let valueString = "";
		let hasNumberFront = false;
		let hasNumberBack = false;
		let hasDot = false;
		for (let i = 0; i < content.length; i++) {
			let char = content.charAt(i);

			if (char === " ") {
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

			if (char === ".") {
				if (hasDot) break;
				valueString += ".";
				hasDot = true;
				continue;
			}
		}

		const valueParse = Number.parseFloat(valueString);

		return Number.isNaN(valueParse) ? 0 : valueParse;
	}

	static get DefaultCurrency() {
		return "RM";
	}
	static parse(any) {
		if (any instanceof Price) return any;
		if (typeof any === "number") return new Price(any);
		if (typeof any === "string") {
			const currencyParses = [];
			const amountParsed = this.#parseAmount(any);

			while (true) {
				let currencyParsed = this.#parseCurrency(any);
				if (!currencyParsed.value) break;
				currencyParses.push(currencyParsed);
				any = any.substring(currencyParsed.indexEnd, any.length);
			}

			return new Price(
				amountParsed,
				currencyParses.length ? currencyParses[0].value : "",
			);
		}

		return new Price();
	}

	#amount;
	#currency;

	constructor(amount = 0, currency = "RM") {
		this.#currency =
			typeof currency === "string"
				? currency.trim().replace(" ", "").toUpperCase()
				: "";
		this.#amount = isNaN(amount) ? 0 : Number(amount);
	}

	get amount() {
		return this.#amount;
	}
	get currency() {
		return this.#currency;
	}

	compare() {
		return this.#amount - item.#amount;
	}

	plus(any) {
		const price = Price.parse(any);
		return new Price(this.#amount + price.#amount, this.#currency);
	}
	minus(any) {
		const price = Price.parse(any);
		return new Price(this.#amount - price.#amount, this.#currency);
	}

	toString() {
		const { amount, currency } = this;

		let text = amount.toFixed(2);
		let comaIndex = text.indexOf(".") - 3;
		while (comaIndex > 0) {
			text = `${text.substring(0, comaIndex)},${text.substring(
				comaIndex,
				text.length,
			)}`;
			comaIndex = comaIndex - 3;
		}

		return currency ? `${currency} ${text}` : `${text}`;
	}
}
