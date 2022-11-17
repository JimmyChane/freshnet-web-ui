import ModuleSpecification from "./data/ProductSpecification.js";
import U from "@/U";

class ProductSpecContent {
	stores = null;
	specificationStore = null;

	constructor(stores) {
		this.stores = stores;
		this.specificationStore = stores.specification;
	}

	content = "";
	type = "";
	typeKey = "";

	fromData(data) {
		data = ModuleSpecification.trim({
			type: data.key,
			content: data.content,
		});

		this.content = data.content;
		this.type = data.type;
		this.typeKey = data.type;
		this.fetchType();

		return this;
	}
	toData() {
		return {
			key: this.type ? this.type.key : undefined,
			content: this.content,
		};
	}
	toCount(strs) {
		return 0;
	}

	compare(item) {
		return 0;
	}

	async fetchType() {
		if (!U.isString(this.type)) return this.type;

		const specifications = await this.specificationStore.dispatch("getItems");
		const specification = specifications.find((spec) => {
			return spec.key == this.typeKey;
		});
		this.type = specification;
		return this.type;
	}
}

export default ProductSpecContent;
