import HostRequest from "./HostRequest.js";
import HostResponse from "./HostResponse.js";
import Text from "@/items/data/Text.js";

class ApiHost {
	static #dev_port = 80;
	static #parseOrigin(protocol, hostname, port) {
		port = port === 80 ? "" : `:${port}`;
		return `${protocol}//${hostname}${port}`;
	}

	get #pathCloudinary() {
		return "https://res.cloudinary.com/freshnet/image/upload/";
	}
	get origin() {
		// return "https://www.freshnet.app";
		const { protocol, hostname } = window.location;
		return ApiHost.#parseOrigin(protocol, hostname, ApiHost.#dev_port);
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

				return `${this.origin}/api/image/name/${name}${query}`;
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
		return `${this.origin}/resource/${url}`;
	}
	cloudinary(param = { url: "" }) {
		let { url } = param;
		url = typeof url === "string" ? Text.trim(url, "") : "";
		if (url === "") return "";
		return `${this.#pathCloudinary}resource/${url}`;
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

		if (url) url = `${this.origin}/api/${url}`;
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
