import { isString } from '@/U';
import { HOST_RES } from '@/freshnet.config';

export class Icon {
  private name: string = '';
  private ext?: string = undefined;

  constructor(name: string = '', ext: string | undefined = undefined) {
    if (isString(name)) this.name = name;
    if (isString(ext)) this.ext = ext;
  }

  toUrl(): string {
    const filename = !isString(this.ext)
      ? this.name
      : `${this.name}.${this.ext}`;
    return `${HOST_RES}/icon/${filename}`;
  }
  toName(): string {
    return this.name;
  }
}

export class ServerResource {
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

export function urlIcon(
  name: string = '',
  ext: string | undefined = undefined,
): string {
  return new Icon(name, ext).toUrl();
}
