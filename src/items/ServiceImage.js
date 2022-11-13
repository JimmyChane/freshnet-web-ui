import ApiHost from "@/host/ApiHost";

class ServiceImage {
	stores = null;

	constructor(stores) {
		this.stores = stores;
	}

	name = "";
	path = "";
	method = "";
	storageType = "";

	fromData(data) {
		this.name = data.name;
		this.path = data.path;
		this.method = data.method;
		this.storageType = data.storageType;
		return this;
	}
	toData() {
		return {
			name: this.name,
			path: this.path,
			method: this.method,
			storageType: this.storageType,
		};
	}
	toCount(strs) {
		return 0;
	}
	toUrl(option = { width: 0, height: 0 }) {
		let { width = 0, height = 0 } = option;
		width = width > 0 ? width : 0;
		height = height > 0 ? height : 0;

		let { path, method } = this;

		if (method === "storage-image") {
			const prefix = "/api/image/name/";
			const name = path.substring(prefix.length, path.length);
			return ApiHost.imgFile.name(name, { width, height });
		}

		let query = "";
		if (width != 0 && height == 0) {
			query = `?width=${width}`;
		} else if (width == 0 && height != 0) {
			query = `?height=${height}`;
		} else if (width > 0 && height > 0) {
			query = `?width=${width}&height=${height}`;
		}

		return `${ApiHost.origin}/api/service_v2/get/image/${this.name}${query}`;
	}
}

export default ServiceImage;
