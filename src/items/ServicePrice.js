export default class ServicePrice {
	amount = 0;
	currency = "rm";

	fromData(data) {
		this.amount = isNaN(data.amount) ? 0 : Number(data.amount);
		this.currency = data.currency ? data.currency : "rm";
		return this;
	}
	toData() {
		return {
			amount: this.amount,
			currency: this.currency,
		};
	}
	toCount(strs) {
		return 0;
	}
	toString() {
		let currency = this.currency ? this.currency.toUpperCase() : "RM";
		let amount = (this.amount ? Number(this.amount) : 0).toFixed(2);
		return `${currency} ${amount}`;
	}

	plus(value) {
		if (value instanceof ServicePrice) {
			return new ServicePrice().fromData({
				amount: Number(this.amount) + Number(value.amount),
				currency: this.currency,
			});
		} else {
			const plus = isNaN(value) ? 0 : Number(value);
			const newAmount = this.amount + plus;

			return new ServicePrice().fromData({
				amount: newAmount,
				currency: this.currency,
			});
		}
	}

	compare(item) {
		return this.amount - item.amount;
	}
}
