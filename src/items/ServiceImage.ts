import { trimId } from '@/U';
import { originApiServer } from '@/host/Server';

import Filename from '../objects/Filename';
import Image, { MethodImage, dimensionToQuery } from './Image';

interface ServiceImageData {
  name: string;
  path: string;
  method: string;
  storageType: string;
}

export default class ServiceImage {
  stores: any;
  loginStore: any;

  constructor(stores: any) {
    this.stores = stores;
    this.loginStore = stores.login;
  }

  name: string = '';
  path: string = '';
  method: string = '';
  storageType: string = '';

  fromData(data: ServiceImageData): this {
    const image = new Image().fromData({
      path: data.path,
      method: data.method,
    });

    this.name = trimId(data.name);
    this.path = image.path;
    this.method = image.method;
    this.storageType = trimId(data.storageType);
    return this;
  }

  toData(): ServiceImageData {
    const image = new Image()
      .fromData({ path: this.path, method: this.method })
      .toData();
    return {
      name: trimId(this.name),
      path: image.path,
      method: image.method,
      storageType: trimId(this.storageType),
    };
  }

  toCount(strs: string[]): number {
    return 0;
  }

  toUrl(
    option: { width: number; height: number } = { width: 0, height: 0 },
  ): string {
    const { width = 0, height = 0 } = option;

    const { path, method } = this;
    const dimensionQuery = dimensionToQuery(width, height);
    const query = dimensionQuery.length ? `?${dimensionQuery}` : '';

    if (method === MethodImage.StorageImage) {
      const prefix = '/api/image/name/';
      const name = path.substring(prefix.length, path.length);
      const filename = new Filename(name);
      return `${originApiServer()}/image/name/${filename.toString()}${query}`;
    }

    const filename = new Filename(this.name);
    return `${originApiServer()}/service_v2/get/image/${filename.toString()}${query}`;
  }

  async toBlob(
    option: { width: number; height: number } = { width: 0, height: 0 },
  ): Promise<string> {
    const { width = 0, height = 0 } = option;

    const url = this.toUrl({ width, height });
    const options = {
      headers: { authorization: this.loginStore.getters.token },
    };
    const response = await fetch(url, options);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
