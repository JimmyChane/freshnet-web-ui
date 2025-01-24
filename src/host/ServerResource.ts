import { isString } from '@/U';

const config = require('@/../freshnet.config');

export class Icon {
  private name: string = '';
  private ext?: string = undefined;

  static url(name: string = '', ext: string | undefined = undefined): string {
    return new Icon(name, ext).toUrl();
  }

  constructor(name: string = '', ext: string | undefined = undefined) {
    if (isString(name)) this.name = name;
    if (isString(ext)) this.ext = ext;
  }

  toUrl(): string {
    const filename = !isString(this.ext)
      ? this.name
      : `${this.name}.${this.ext}`;
    return `${config.hostRes}/icon/${filename}`;
  }
  toName(): string {
    return this.name;
  }
}

export default class ServerResource {
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  icon(name: string = '', ext: string = 'svg'): Icon {
    return new Icon(name, ext);
  }
  res(path: string): string {
    return `${this.serverUrl}/${path}`;
  }
}
