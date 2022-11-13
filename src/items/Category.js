import Image from "./Image";
import ModuleCategory from "./data/Category";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class Category {
	static Key = ModuleCategory.Key;

	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	id = "";
	key = "";
	title = "";
	icon = null;
	background = null;

	fromData(data) {
		data = ModuleCategory.trim(data);

		this.id = data._id;
		this.key = data.key;
		this.title = data.title;
		this.icon =
			typeof data.icon === "object" ? new Image().fromData(data.icon) : null;
		this.background =
			typeof data.background === "object"
				? new Image().fromData(data.background)
				: null;

		return this;
	}
	toData() {
		return {
			_id: this.id,
			key: this.key,
			title: this.title,
			icon: this.icon ? this.icon.toData() : {},
			background: this.background ? this.background.toData() : {},
		};
	}
	toCount(strs) {
		const { title } = this;
		return strs.reduce((count, str) => {
			if (title === "Notebook") count += textContains("Laptop", str) ? 1 : 0;
			count += textContains(title, str) ? 1 : 0;
			count += textContains("category", str) ? 1 : 0;
			return count;
		}, 0);
	}

	compare(item) {
		const keyOrder = Object.keys(ModuleCategory.Key).map((key) => {
			return ModuleCategory.Key[key];
		});

		let index1 = keyOrder.indexOf(this.key);
		let index2 = keyOrder.indexOf(item.key);
		index1 = index1 == -1 ? keyOrder.length : index1;
		index2 = index2 == -1 ? keyOrder.length : index2;

		return index1 > index2 ? 1 : index1 < index2 ? -1 : 0;
	}
}

export default Category;
