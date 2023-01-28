import Text from "@/items/data/Text.js";
import config from "@/../freshnet.config";
import U from "@/U";

class HostRequest {
	#bind = { method: "GET", url: "", headers: {}, body: undefined };

	GET() {
		return this.method("GET");
	}
	POST() {
		return this.method("POST");
	}
	PUT() {
		return this.method("PUT");
	}
	DELETE() {
		return this.method("DELETE");
	}
	method(method = "GET") {
		this.#bind.method = method;
		return this;
	}

	headers(headers = {}) {
		this.#bind.headers = headers;
		return this;
	}
	contentTypeJson() { 
		if (!U.isObject(this.#bind.headers) || U.isArray(this.#bind.headers)) {
			this.#bind.headers = {};
		}
		this.#bind.headers["Content-Type"] = "application/json;charset=UTF-8";
		return this;
	}

	url(url = "") {
		this.#bind.url = url;
		return this;
	}

	body(body = undefined) {
		this.#bind.body = body ? JSON.stringify(body) : undefined;
		return this;
	}
	bodyObject(body = undefined) {
		this.#bind.body = body;
		return this;
	}

	async send() {
		this.contentTypeJson();

		let { method = "GET", url = "", headers = {}, body = undefined } = this.#bind;

		if (url) url = `${config.hostApi}/${url}`;
		if (window.localStorage.getItem("userToken")) {
			headers.authorization = window.localStorage.getItem("userToken");
		}

		const response = await fetch(url, { method, headers, body });
		const json = await response.json();
		const hostResponse = new HostResponse(json);

		if (hostResponse.getError()) throw new Error(hostResponse.getError());
		return hostResponse;
	}
	async sendNotJson() {
		let { method = "GET", url = "", headers = {}, body = undefined } = this.#bind;

		if (url) url = `${config.hostApi}/${url}`;
		if (window.localStorage.getItem("userToken")) {
			headers.authorization = window.localStorage.getItem("userToken");
		}

		const response = await fetch(url, { method, headers, body });
		const json = await response.json();
		const hostResponse = new HostResponse(json);

		if (hostResponse.getError()) throw new Error(hostResponse.getError());
		return hostResponse;
	}
}
class HostResponse {
	#apiJson = null;

	constructor(apiJson) {
		this.#apiJson = apiJson;
	}

	getError() {
		return this.#apiJson.error;
	}
	getErrorFriendly() {
		return this.#apiJson.friendlyError;
	}
	getContent() {
		return this.#apiJson.content;
	}

	get error() {
		return this.getError();
	}
	get friendlyError() {
		return this.getErrorFriendly();
	}
	get content() {
		return this.getContent();
	}
}

class ApiHost {
	get origin() {
		return config.host;
	}
	get originApi(){
		return config.hostApi;
	}

	res(url) {
		return `${config.hostRes}/${url}`;
	}
	cloudinary(param = { url: "" }) {
		let { url } = param;
		url = U.isString(url) ? Text.trim(url, "") : "";
		if (url === "") return "";
		return `${config.cloudinaryRes}/${url}`;
	}
	request() {
		return new HostRequest();
	}
}

export default new ApiHost();
