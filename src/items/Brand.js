import Image from "./Image.js";
import ModuleBrand from "./data/ProductBrand.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class Brand {
	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	id = "";
	title = "";
	icon = null;

	fromData(data) {
		data = ModuleBrand.trim(data);
		this.id = data._id;
		this.title = data.title;
		this.icon = data.icon ? new Image().fromData(data.icon) : null;
		return this;
	}
	toData() {
		return {
			_id: this.id,
			title: this.title,
			icon: this.icon ? this.icon.toData() : {},
		};
	}
	toCount(strs) {
		return strs.reduce((count, str) => {
			count += textContains(this.title, str) ? 1 : 0;
			count += textContains("brand", str) ? 1 : 0;
			return count;
		}, 0);
	}

	isEqual(obj) {
		return this.id == obj.id && this.title == obj.title;
	}

	compare(item) {
		return 0;
	}
}

export default Brand;
