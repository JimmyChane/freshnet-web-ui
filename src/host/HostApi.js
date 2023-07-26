const config = require("@/../freshnet.config");
import U from "@/U";
import HostIcon from "./HostIcon";
class HostRequest {
    bind = {
        url: "",
        method: "GET",
        headers: {},
        body: undefined,
    };
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
    method(method) {
        this.bind.method = method;
        return this;
    }
    headers(headers) {
        this.bind.headers = headers;
        return this;
    }
    contentTypeJson() {
        if (!U.isObject(this.bind.headers) || U.isArray(this.bind.headers)) {
            this.bind.headers = {};
        }
        this.bind.headers["Content-Type"] = "application/json;charset=UTF-8";
        return this;
    }
    url(url) {
        this.bind.url = url;
        return this;
    }
    body(body) {
        this.bind.body = body ? JSON.stringify(body) : undefined;
        return this;
    }
    bodyObject(body) {
        this.bind.body = body;
        return this;
    }
    async send() {
        this.contentTypeJson();
        let { method, url, headers, body } = this.bind;
        if (url)
            url = `${config.hostApi}/${url}`;
        if (window.localStorage.getItem("userToken")) {
            headers.authorization = window.localStorage.getItem("userToken");
        }
        const response = await fetch(url, { method, headers, body });
        const json = await response.json();
        const hostResponse = new HostResponse(json);
        const hostError = hostResponse.getError();
        if (hostError) {
            throw new Error(hostError);
        }
        return hostResponse;
    }
    async sendNotJson() {
        let { method, url, headers, body } = this.bind;
        if (url)
            url = `${config.hostApi}/${url}`;
        if (window.localStorage.getItem("userToken")) {
            headers.authorization = window.localStorage.getItem("userToken");
        }
        const response = await fetch(url, { method, headers, body });
        const json = await response.json();
        const hostResponse = new HostResponse(json);
        const hostError = hostResponse.getError();
        if (hostError) {
            throw new Error(hostError);
        }
        return hostResponse;
    }
}
class HostResponse {
    apiJson = null;
    constructor(apiJson) {
        this.apiJson = apiJson;
    }
    getError() {
        return this.apiJson.error;
    }
    getErrorFriendly() {
        return this.apiJson.friendlyError;
    }
    getContent() {
        const error = this.getError();
        const friendlyError = this.getErrorFriendly();
        if (error) {
            if (friendlyError) {
                throw new Error(friendlyError);
            }
            else {
                throw new Error(error);
            }
        }
        return this.optContent();
    }
    optContent() {
        return this.apiJson.content;
    }
    getArrayContent() {
        const content = this.getContent();
        if (!U.isArray(content)) {
            throw new Error("content not array");
        }
        return content;
    }
    optArrayContent() {
        const content = this.getContent();
        return U.optArray(content) ? content : undefined;
    }
    getObjectContent() {
        const content = this.getContent();
        if (U.isArray(content))
            throw new Error("content array");
        if (!U.isObject(content))
            throw new Error("content not object");
        if (content === undefined)
            throw new Error("content undefined");
        if (content === null)
            throw new Error("content null");
        return content;
    }
    optObjectContent() {
        const content = this.getContent();
        if (U.isArray(content) || !U.isObjectOnly(content)) {
            return {};
        }
        return U.optObject(content);
    }
    getStringContent() {
        const content = this.getContent();
        if (typeof content !== "string") {
            throw new Error("content not string");
        }
        return content;
    }
    optStringContent() {
        const content = this.getContent();
        return typeof content === "string" ? content : undefined;
    }
}
class HostApi {
    get originApi() {
        return config.hostApi;
    }
    icon(name = "", ext = "svg") {
        return HostIcon.url(name, ext);
    }
    res(url) {
        return `${config.hostRes}/${url}`;
    }
    cloudinary(param = { url: "" }) {
        let { url } = param;
        url = U.trimId(url);
        if (url === "")
            return "";
        return `${config.cloudinaryRes}/${url}`;
    }
    request() {
        return new HostRequest();
    }
}
export default new HostApi();
