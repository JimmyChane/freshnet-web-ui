import { trimId } from '@/U';
import { CLOUDINARY_RES, HOST_API, HOST_RES } from '@/freshnet.config';

import { Request, ServerApi } from './ServerApi';
import { Icon, ServerResource } from './ServerResource';

export const resourceServer = new ServerResource(HOST_RES);
export const apiServer = new ServerApi(HOST_API);

export function originApiServer(): string {
  return HOST_API;
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
  return `${CLOUDINARY_RES}/${url}`;
}

export function requestServer(): Request {
  return apiServer.request();
}
