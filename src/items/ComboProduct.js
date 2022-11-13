import Image from "./Image";
import ProductPrice from "./ProductPrice";
import ComboProductModule from "./data/ComboProduct.js";
import U from "@/U";

class ComboProduct {
	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	id = "";
	images = [];
	price = null;
	productIDs = [];

	fromData(data) {
		data = ComboProductModule.trim(data);

		this.id = data._id;
		this.images = U.optArray(data.images).map((image) => {
			return new Image().fromData(image);
		});
		this.price = ProductPrice.parseString(data.price);
		this.productIDs = U.optArray(data.productIDs).map((productID) => {
			return productID;
		});

		return this;
	}
	toData() {
		return {
			_id: this.id,
			images: this.images.map((image) => (image ? image.toData() : {})),
			price: this.price.toData(),
			productIDs: this.productIDs.map((x) => x),
		};
	}
	toCount(strs) {
		return 0;
	}

	compare(item) {
		return 0;
	}
}

export default ComboProduct;
