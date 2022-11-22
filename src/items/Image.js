import ApiHost from "@/host/ApiHost.js";
import ModuleImage from "./data/Image.js";

const getColors = require("get-image-colors"); // https://www.npmjs.com/package/get-image-colors

class Image {
	static Method = ModuleImage.Method;

	method;
	path;

	fromData(data) {
		data = new ModuleImage(data);
		this.method = data.method;
		this.path = data.path;
		return this;
	}
	toData() {
		return new ModuleImage({
			method: this.method,
			path: this.path,
		});
	}
	toCount(strs) {
		return 0;
	}
	toUrl(option = { width: 0, height: 0 }) {
		let { width = 0, height = 0 } =
			typeof option === "object" && option !== null ? option : {};
		let method = this.method;
		let path = this.path;

		if (method && path) {
			if (method === Image.Method.Local) return `${ApiHost.origin}/${path}`;
			if (method === Image.Method.Link) return path;
			if (method === Image.Method.StorageImage) {
				const prefix = "/api/image/name/";
				const name = path.substring(prefix.length, path.length);
				return ApiHost.imgFile.name(name, { width, height });
			}
		}
		return "";
	}

	async fetchColor() {
		const palettes = await getColors(this.toUrl({ width: 20 }), { count: 1 });
		return palettes[0];
	}
}

export default Image;
