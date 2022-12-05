import Price from "@/objects/Price";

class ProductPrice {
	static Currency = Price.DefaultCurrency;

	static parseString(content) {
		const price = Price.parse(content);
		return new ProductPrice().fromData({
			currency: price.currency,
			value: price.amount,
		});
	}

	#price = null;

	constructor(data) {
		this.fromData(data);
	}

	fromData(data = { currency: "", value: 0 }) {
		this.#price = new Price(data.value, data.currency);
		return this;
	}
	toData() {
		return {
			currency: this.#price.currency,
			value: this.#price.amount,
		};
	}
	toString() {
		return this.#price.toString();
	}
	toCount(strs) {
		return 0;
	}

	compare(item) {
		return 0;
	}

	get value() {
		return this.#price.amount;
	}
	get currency() {
		return this.#price.currency;
	}
}

export default ProductPrice;
