import ModulePs2Disc from "./data/Ps2Disc.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class Ps2Disc {
	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	id = "";
	code = "";
	title = "";

	fromData(data) {
		data = ModulePs2Disc.trim(data);

		this.id = data._id;
		this.code = data.code;
		this.title = data.title;

		return this;
	}
	toData() {
		return new ModulePs2Disc({
			_id: this.id,
			code: this.code,
			title: this.title,
		});
	}
	toCount(strs) {
		return strs.reduce((count, str) => {
			count += textContains("ps2", str) ? 1 : 0;
			count += textContains("disc", str) ? 1 : 0;
			count += textContains(this.code, str) ? 1 : 0;
			count += textContains(this.title, str) ? 1 : 0;
			return count;
		}, 0);
	}

	compare(item) {
		return this.title.localeCompare(item.title);
	}
}

export default Ps2Disc;
