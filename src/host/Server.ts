import { trimId } from '@/U';

import ServerApi, { Request } from './ServerApi';
import ServerResource, { Icon } from './ServerResource';

const config = require('@/../freshnet.config');

class Server {
  static readonly resource = new ServerResource(config.hostRes);
  static readonly api = new ServerApi(config.hostApi);

  static get originApi(): string {
    return config.hostApi;
  }

  static icon(name: string = '', ext: string = 'svg'): Icon {
    return this.resource.icon(name, ext);
  }

  static res(path: string): string {
    return this.resource.res(path);
  }

  static cloudinary(param: { url: string } = { url: '' }): string {
    let { url } = param;
    url = trimId(url);
    if (url === '') return '';
    return `${config.cloudinaryRes}/${url}`;
  }

  static request(): Request {
    return this.api.request();
  }
}

export default Server;
