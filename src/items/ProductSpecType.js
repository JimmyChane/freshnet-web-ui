import Image from "./Image";
import SpecificationType from "./data/SpecificationType";
import U from "@/U";

class ProductSpecType {
	static Key = SpecificationType.Key;

	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	id = "";
	key = "";
	title = "";
	icon = null;
	color = "";

	fromData(data) {
		data = SpecificationType.trim(data);

		this.id = data._id;
		this.key = data.key;
		this.title = data.title;
		this.icon = U.isObject(data.icon) ? new Image().fromData(data.icon) : "";
		this.color = data.color;

		return this;
	}
	toData() {
		return {
			_id: this.id,
			key: this.key,
			title: this.title,
			icon: this.icon ? this.icon.toData() : {},
			color: this.color,
		};
	}
	toCount(strs) {
		return 0;
	}

	compare(item) {
		return 0;
	}
}

export default ProductSpecType;
