import { trimId } from '@/U';

import ServerApi, { Request } from './ServerApi';
import ServerResource, { Icon } from './ServerResource';

const config = require('@/../freshnet.config');

class Server {}

export default Server;

export const resourceServer = new ServerResource(config.hostRes);
export const apiServer = new ServerApi(config.hostApi);

export function originApiServer(): string {
  return config.hostApi;
}

export function iconServer(name: string = '', ext: string = 'svg'): Icon {
  return resourceServer.icon(name, ext);
}

export function resServer(path: string): string {
  return resourceServer.res(path);
}

export function cloudinaryServer(param: { url: string } = { url: '' }): string {
  let { url } = param;
  url = trimId(url);
  if (url === '') return '';
  return `${config.cloudinaryRes}/${url}`;
}

export function requestServer(): Request {
  return apiServer.request();
}
