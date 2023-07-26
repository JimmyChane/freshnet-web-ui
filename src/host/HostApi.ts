const config = require("@/../freshnet.config");
import U from "@/U";
import HostIcon from "./HostIcon";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  url: string;
  method: HttpMethod;
  headers: Record<string, any>;
  body?: BodyInit | null;
}

class HostRequest {
  private bind: RequestOptions = {
    url: "",
    method: "GET",
    headers: {},
    body: undefined,
  };

  GET(): this {
    return this.method("GET");
  }

  POST(): this {
    return this.method("POST");
  }

  PUT(): this {
    return this.method("PUT");
  }

  DELETE(): this {
    return this.method("DELETE");
  }

  method(method: HttpMethod): this {
    this.bind.method = method;
    return this;
  }

  headers(headers: HeadersInit): this {
    this.bind.headers = headers;
    return this;
  }

  contentTypeJson(): this {
    if (!U.isObject(this.bind.headers) || U.isArray(this.bind.headers)) {
      this.bind.headers = {};
    }
    this.bind.headers["Content-Type"] = "application/json;charset=UTF-8";
    return this;
  }

  url(url: string): this {
    this.bind.url = url;
    return this;
  }

  body(body: any): this {
    this.bind.body = body ? JSON.stringify(body) : undefined;
    return this;
  }

  bodyObject(body: any): this {
    this.bind.body = body;
    return this;
  }

  async send(): Promise<HostResponse> {
    this.contentTypeJson();

    let { method, url, headers, body } = this.bind;

    if (url) url = `${config.hostApi}/${url}`;
    if (window.localStorage.getItem("userToken")) {
      headers.authorization = window.localStorage.getItem("userToken");
    }

    const response = await fetch(url, { method, headers, body });
    const json = await response.json();
    const hostResponse: HostResponse = new HostResponse(json);

    const hostError = hostResponse.getError();
    if (hostError) {
      throw new Error(hostError);
    }
    return hostResponse;
  }

  async sendNotJson(): Promise<HostResponse> {
    let { method, url, headers, body } = this.bind;

    if (url) url = `${config.hostApi}/${url}`;
    if (window.localStorage.getItem("userToken")) {
      headers.authorization = window.localStorage.getItem("userToken");
    }

    const response = await fetch(url, { method, headers, body });
    const json = await response.json();
    const hostResponse: HostResponse = new HostResponse(json);

    const hostError = hostResponse.getError();
    if (hostError) {
      throw new Error(hostError);
    }
    return hostResponse;
  }
}

class HostResponse {
  private apiJson: any = null;

  constructor(apiJson: any) {
    this.apiJson = apiJson;
  }

  getError(): string | null {
    return this.apiJson.error;
  }

  getErrorFriendly(): string | null {
    return this.apiJson.friendlyError;
  }

  getContent(): any {
    const error = this.getError();
    const friendlyError = this.getErrorFriendly();
    if (error) {
      if (friendlyError) {
        throw new Error(friendlyError);
      } else {
        throw new Error(error);
      }
    }
    return this.optContent();
  }

  optContent(): any {
    return this.apiJson.content;
  }

  getArrayContent(): any[] {
    const content = this.getContent();
    if (!U.isArray(content)) {
      throw new Error("content not array");
    }
    return content;
  }

  optArrayContent(): any[] | undefined {
    const content = this.getContent();
    return U.optArray(content) ? content : undefined;
  }

  getObjectContent(): object {
    const content = this.getContent();
    if (U.isArray(content)) throw new Error("content array");
    if (!U.isObject(content)) throw new Error("content not object");
    if (content === undefined) throw new Error("content undefined");
    if (content === null) throw new Error("content null");
    return content;
  }

  optObjectContent(): object | undefined {
    const content = this.getContent();
    if (U.isArray(content) || !U.isObjectOnly(content)) {
      return {};
    }
    return U.optObject(content);
  }

  getStringContent(): string {
    const content = this.getContent();
    if (typeof content !== "string") {
      throw new Error("content not string");
    }
    return content;
  }

  optStringContent(): string | undefined {
    const content = this.getContent();
    return typeof content === "string" ? content : undefined;
  }
}

class HostApi {
  get originApi(): string {
    return config.hostApi;
  }

  icon(name: string = "", ext: string = "svg"): string {
    return HostIcon.url(name, ext);
  }

  res(url: string): string {
    return `${config.hostRes}/${url}`;
  }

  cloudinary(param: { url: string } = { url: "" }): string {
    let { url } = param;
    url = U.trimId(url);
    if (url === "") return "";
    return `${config.cloudinaryRes}/${url}`;
  }

  request(): HostRequest {
    return new HostRequest();
  }
}

export default new HostApi();
