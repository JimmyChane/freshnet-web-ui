import PhoneNumber from "./PhoneNumber.js";
import U from "@/U.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ServiceCustomer {
	stores = null;
	constructor(stores) {
		this.stores = stores;
	}

	names = [];
	phoneNumbers = [];

	// legacy
	get name() {
		return this.names[0];
	}
	// legacy
	get phoneNumber() {
		return this.phoneNumbers[0];
	}

	fromData(data) {
		this.names = (Array.isArray(data.names) ? data.names : [data.name])
			.map((name) => U.optString(name))
			.filter((name) => name.length);

		this.phoneNumbers = (
			Array.isArray(data.phoneNumbers) ? data.phoneNumbers : [data.phoneNumber]
		)
			.map((dataPhoneNumber) => {
				if (!dataPhoneNumber) return null;
				return new PhoneNumber(this.stores).fromData(dataPhoneNumber);
			})
			.filter((phoneNumber) => phoneNumber !== null);

		return this;
	}
	toData() {
		return {
			name: this.name, // legacy
			phoneNumber: this.phoneNumber ? this.phoneNumber.toData() : "", // legacy
			names: this.names.map((name) => name),
			phoneNumbers: this.phoneNumbers.map((phoneNumber) =>
				phoneNumber.toData(),
			),
		};
	}
	toCount(strs) {
		return strs.reduce((count, str) => {
			if (textContains("customer", str)) count++;
			count += this.names.reduce((count, name) => {
				if (textContains(name, str)) count++;
				return count;
			}, 0);
			count += this.phoneNumbers.reduce((count, phoneNumber) => {
				if (textContains(phoneNumber.toString(), str)) count++;
				return count;
			}, 0);
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
