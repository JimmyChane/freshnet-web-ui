import HostRequest from "./HostRequest.js";
import HostResponse from "./HostResponse.js";
import Text from "@/items/data/Text.js";

import config from "@/../freshnet.config";

class ApiHost {
	get origin() {
		return config.host;
	}
	get imgFile() {
		return {
			name: (name, option = {}) => {
				let { width = 0, height = 0 } = option;
				width = width > 0 ? width : 0;
				height = height > 0 ? height : 0;

				let query = "";
				if (width != 0 && height == 0) {
					query = `?width=${width}`;
				} else if (width == 0 && height != 0) {
					query = `?height=${height}`;
				} else if (width > 0 && height > 0) {
					query = `?width=${width}&height=${height}`;
				}

				return `${config.hostApi}/image/name/${name}${query}`;
			},
			list: () => this.api({ url: `image/list` }).then((json) => json.content),
			upload: (images = []) => {
				const formData = new FormData();
				images.forEach((image) => formData.append(image.name, image));

				return this.fetch({
					method: "POST",
					url: `image/upload`,
					body: formData,
				});
			},
			remove: (name) => {
				return this.request().DELETE().url(`image/delete/${name}`).send();
			},
		};
	}

	res(url) {
		return `${config.hostRes}/${url}`;
	}
	cloudinary(param = { url: "" }) {
		let { url } = param;
		url = typeof url === "string" ? Text.trim(url, "") : "";
		if (url === "") return "";
		return `${config.cloudinaryRes}/${url}`;
	}

	request() {
		return new HostRequest(this);
	}
	api(param = { method: "GET", url: "", headers: {}, body: undefined }) {
		return this.request()
			.method(param.method)
			.url(param.url)
			.headers(param.headers)
			.body(param.body)
			.send();
	} //legacy
	async fetch(param = {}) {
		let { method = "GET", url = "", headers = {}, body = undefined } = param;

		if (url) url = `${config.hostApi}/${url}`;
		if (window.localStorage.getItem("userToken")) {
			headers.authorization = window.localStorage.getItem("userToken");
		}

		try {
			let response = await fetch(url, { method, headers, body });
			let json = await response.json();
			let hostResponse = new HostResponse(json);

			if (hostResponse.getError()) {
				console.error("ApiHost Response:", hostResponse.getError());
			}

			return hostResponse;
		} catch (error) {
			console.error("Fetch:", error);
			throw error;
		}
	}
}

export default new ApiHost();
