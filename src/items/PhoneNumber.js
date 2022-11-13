import ModulePhoneNumber from "./data/PhoneNumber.js";

class PhoneNumber {
	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	value = "";

	fromData(data) {
		this.value = data;
		return this;
	}
	toData() {
		return this.value;
	}
	toString() {
		return ModulePhoneNumber.parseToString(this.value);
	}
	toCount(strs) {
		return 0;
	}

	compare(item) {
		return 0;
	}

	isEqual(item) {
		return item.value === this.value;
	}
}

export default PhoneNumber;
