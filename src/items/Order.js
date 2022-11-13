import ModuleOrder from "./data/Order.js";
import OrderCustomer from "./OrderCustomer.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class Order {
	static STATUS = {
		PENDING: ModuleOrder.Status.Pending,
		COMPLETED: ModuleOrder.Status.Completed,
	};
	static STATUS_PENDING = ModuleOrder.Status.Pending; // legacy
	static STATUS_COMPLETED = ModuleOrder.Status.Completed; //legacy

	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	id = "";
	// customer_name = "";
	// phone_number = "";
	customer = null;
	content = "";
	createdAt = "";
	status = Order.STATUS_PENDING;

	fromData(data) {
		data = ModuleOrder.trim(data);

		this.id = data._id;
		// this.customer_name = data.customer_name;
		// this.phone_number = data.phone_number;
		this.customer = new OrderCustomer(this.stores).fromData({
			name: data.customer_name,
			phoneNumber: data.phone_number,
		});
		this.content = data.content;
		this.createdAt = data.createdAt;
		this.status = data.status;

		return this;
	}
	toData() {
		const customer = this.customer.toData();
		return {
			_id: this.id,
			content: this.content,
			customer_name: customer.name,
			phone_number: customer.phoneNumber,
			createdAt: this.createdAt,
			status: this.status,
		};
	}
	toCount(strs) {
		let count = strs.reduce((count, str) => {
			count += textContains("order", str) ? 1 : 0;
			count += textContains(this.content, str) ? 1 : 0;
			count += textContains(this.customer_name, str) ? 1 : 0;
			count += textContains(this.phone_number, str) ? 1 : 0;
			count += textContains(this.status, str) ? 1 : 0;
			return count;
		}, 0);
		count += this.customer.toCount(strs);

		return count;
	}

	compare(item) {
		return 0;
	}
}

export default Order;
