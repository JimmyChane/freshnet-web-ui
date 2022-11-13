import PhoneNumber from "./PhoneNumber.js";
import U from "@/U.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ServiceCustomer {
	stores = null;
	constructor(stores) {
		this.stores = stores;
	}

	name = "";
	phoneNumber = null;

	fromData(data) {
		this.name = U.optString(data.name);
		this.phoneNumber = data.phoneNumber
			? new PhoneNumber(this.stores).fromData(data.phoneNumber)
			: null;
		return this;
	}
	toData() {
		return {
			name: this.name,
			phoneNumber: this.phoneNumber ? this.phoneNumber.toData() : "",
		};
	}
	toCount(strs) {
		return strs.reduce((count, str) => {
			count += textContains("customer", str) ? 1 : 0;
			count += textContains(this.name, str) ? 1 : 0;
			count += textContains(this.phoneNumber, str) ? 1 : 0;
			return count;
		}, 0);
	}

	compare(item) {
		return this.compareName(item) + this.comparePhoneNumber(item);
	}
	compareName(item) {
		const name1 = U.optString(this.name);
		const name2 = U.optString(item.name);
		return name1.localeCompare(name2);
	}
	comparePhoneNumber(item) {
		const phoneNumber1 = U.optString(this.phoneNumber);
		const phoneNumber2 = U.optString(item.phoneNumber);
		return phoneNumber1.localeCompare(phoneNumber2);
	}

	isEqual(item) {
		const eName = U.optString(item.name);
		const ePhoneNumber = item.phoneNumber;
		const ePhoneNumberValue = ePhoneNumber ? ePhoneNumber.value : "";

		const name = U.optString(this.name);
		const phoneNumber = this.phoneNumber;
		const phoneNumberValue = phoneNumber ? phoneNumber.value : "";

		return eName === name && ePhoneNumberValue === phoneNumberValue;
	}
}

export default ServiceCustomer;
