import { optArray } from '@chanzor/utils';
import axios, { type AxiosResponse } from 'axios';

import { optObject, trimId } from '@/U';
import { CLOUDINARY_RES, HOST_API, HOST_RES } from '@/config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  url: string;
  method: HttpMethod;
  headers: Record<string, any>;
  body?: BodyInit | null;
}
export class ServerRequest {
  private bind: RequestOptions = {
    url: '',
    method: 'GET',
    headers: {},
    body: undefined,
  };

  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  GET(): this {
    return this.method('GET');
  }
  POST(): this {
    return this.method('POST');
  }
  PUT(): this {
    return this.method('PUT');
  }
  DELETE(): this {
    return this.method('DELETE');
  }

  private method(method: HttpMethod): this {
    this.bind.method = method;
    return this;
  }

  headers(headers: HeadersInit): this {
    this.bind.headers = headers;
    return this;
  }

  private contentTypeJson(): this {
    if (
      typeof this.bind.headers !== 'object' ||
      Array.isArray(this.bind.headers)
    ) {
      this.bind.headers = {};
    }
    this.bind.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return this;
  }

  path(path: string): this {
    this.bind.url = `${this.serverUrl}/${path}`;
    return this;
  }

  bodyJson(body: any): this {
    this.bind.body = JSON.stringify(body);
    return this;
  }

  body(body: any): this {
    this.bind.body = body;
    return this;
  }

  async sendJson(): Promise<ServerResponse> {
    this.contentTypeJson();
    return this.send();
  }

  async send(): Promise<ServerResponse> {
    const url = this.bind.url;
    const method = this.bind.method;
    const headers = this.bind.headers;
    const body = this.bind.body;

    let promise: Promise<AxiosResponse<any, any>>;
    switch (method) {
      case 'POST':
        promise = API.post(url, body, { headers: headers });
        break;
      case 'GET':
        promise = API.get(url, { headers: headers });
        break;
      case 'PUT':
        promise = API.put(url, body, { headers: headers });
        break;
      case 'DELETE':
        promise = API.delete(url, { headers: headers });
        break;
    }

    const response = await promise.catch((error) => error);
    if (response instanceof Error) {
      throw response;
    }

    const json = response.data;
    const hostResponse = new ServerResponse(json);
    const hostError = hostResponse.getError();
    if (hostError) {
      throw new Error(hostError);
    }

    return hostResponse;
  }
}
export class ServerResponse {
  private apiJson: any = null;

  constructor(apiJson: any) {
    this.apiJson = apiJson;
  }

  getError(): string | undefined {
    return this.apiJson?.error ?? undefined;
  }

  getErrorFriendly(): string | undefined {
    return this.apiJson?.friendlyError ?? undefined;
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

  optContent(): any | undefined {
    return this.apiJson?.content ?? undefined;
  }

  getArrayContent(): any[] {
    const content = this.getContent();
    if (!Array.isArray(content)) {
      throw new Error('content not array');
    }
    return content;
  }

  optArrayContent(): any[] | undefined {
    const content = this.getContent();
    return optArray(content) ? content : undefined;
  }

  getObjectContent(): object {
    const content = this.getContent();
    if (Array.isArray(content)) throw new Error('content array');
    if (typeof content !== 'object') throw new Error('content not object');
    if (content === undefined) throw new Error('content undefined');
    if (content === null) throw new Error('content null');
    return content;
  }

  optObjectContent(): object | undefined {
    const content = this.getContent();
    if (Array.isArray(content) || !(typeof content === 'object' && content)) {
      return {};
    }
    return optObject(content);
  }

  getStringContent(): string {
    const content = this.getContent();
    if (typeof content !== 'string') {
      throw new Error('content not string');
    }
    return content;
  }

  optStringContent(): string | undefined {
    const content = this.getContent();
    return typeof content === 'string' ? content : undefined;
  }
}
export class ServerApi {
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  request(): ServerRequest {
    return new ServerRequest(this.serverUrl);
  }
}
export class ServerIcon {
  private name: string = '';
  private ext?: string = undefined;

  constructor(name: string = '', ext: string | undefined = undefined) {
    if (typeof name === 'string') this.name = name;
    if (typeof ext === 'string') this.ext = ext;
  }

  toUrl(): string {
    const filename =
      typeof this.ext !== 'string' ? this.name : `${this.name}.${this.ext}`;
    return `${HOST_RES}/icon/${filename}`;
  }
  toName(): string {
    return this.name;
  }
}

export const API = axios.create({ baseURL: 'https://api.freshnet.app' });
API.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('userToken');
  if (token !== null) {
    config.headers.authorization = token;
  }
  return config;
});
API.interceptors.response.use(
  (response) => {
    const json = response.data;
    const hostResponse = new ServerResponse(json);
    const hostError = hostResponse.getError();
    if (hostError) {
      throw new Error(hostError);
    }

    return response;
  },
  (error) => error,
);

export const API_SERVER = new ServerApi(HOST_API);

export function serverRes(path: string): string {
  return `${HOST_RES}/${path}`;
}
export function cloudinaryServer(param: { url: string } = { url: '' }): string {
  let { url } = param;
  url = trimId(url);
  if (url === '') return '';
  return `${CLOUDINARY_RES}/${url}`;
}
