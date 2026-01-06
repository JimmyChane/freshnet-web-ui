import { getString, optString } from '@chanzor/utils';

import { HOST_RES } from '@/config';

export class ServerIconModel {
  private name: string = '';
  private ext?: string = undefined;

  constructor(name: string = '', ext: string | undefined = undefined) {
    this.name = optString(name);
    this.ext = getString(ext);
  }

  toUrl(): string {
    const filename = typeof this.ext !== 'string' ? this.name : `${this.name}.${this.ext}`;
    return `${HOST_RES}/icon/${filename}`;
  }
  toName(): string {
    return this.name;
  }
}
