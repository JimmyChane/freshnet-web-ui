import { trimId } from '@/U';
import { CLOUDINARY_RES, HOST_API, HOST_RES } from '@/config';

import { ServerApi } from './ServerApi';
import { Icon, ServerResource } from './ServerResource';

export const resourceServer = new ServerResource(HOST_RES);
export const apiServer = new ServerApi(HOST_API);

export function cloudinaryServer(param: { url: string } = { url: '' }): string {
  let { url } = param;
  url = trimId(url);
  if (url === '') return '';
  return `${CLOUDINARY_RES}/${url}`;
}
