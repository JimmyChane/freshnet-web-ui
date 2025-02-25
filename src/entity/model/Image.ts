import { isObject, trimId } from '@/U';
import { HOST_API } from '@/config';
import { Filename } from '@/entity/Filename';
import { serverRes } from '@/entity/Server';

interface ImageData {
  method: string;
  path: string;
}

interface ImageUrlOption {
  width?: number;
  height?: number;
}

export enum MethodImage {
  Local = 'local',
  Link = 'link',
  StorageImage = 'storage-image',
}
export enum StorageTypeImage {
  Gcloud = 'gcloudstorage-type1',
  Gdrive = 'gdrive-type2',
}

export function dimensionToQuery(
  width: number = 0,
  height: number = 0,
): string {
  width = width > 0 ? width : 0;
  height = height > 0 ? height : 0;

  if (width !== 0 && height === 0) return `width=${width}`;
  if (width === 0 && height !== 0) return `height=${height}`;
  if (width > 0 && height > 0) return `width=${width}&height=${height}`;
  return '';
}

export class Image {
  method: string = '';
  path: string = '';

  fromData(data: ImageData): this {
    this.method = trimId(data.method);
    this.path = trimId(data.path);
    return this;
  }
  toData(): ImageData {
    return { method: trimId(this.method), path: trimId(this.path) };
  }
  toCount(strs: string[]): number {
    return 0;
  }
  toUrl(option: ImageUrlOption = { width: 0, height: 0 }): string {
    let { width = 0, height = 0 } =
      isObject(option) && option !== null ? option : {};

    const method = this.method;
    const path = this.path;

    if (!method || !path) return '';
    if (method === MethodImage.Local) {
      let resPath = path;
      if (resPath.startsWith('.'))
        resPath = resPath.substring(1, resPath.length);
      if (resPath.startsWith('/'))
        resPath = resPath.substring(1, resPath.length);
      if (resPath.startsWith('resource/')) {
        resPath = resPath.substring('resource/'.length, resPath.length);
        return serverRes(resPath);
      }

      return `${HOST_API}/${path}`;
    }
    if (method === MethodImage.Link) return path;
    if (method === MethodImage.StorageImage) {
      const prefix = '/api/image/name/';
      const name = path.substring(prefix.length, path.length);
      const filename = new Filename(name);
      const dimensionQuery = dimensionToQuery(width, height);
      const query = dimensionQuery.length ? `?${dimensionQuery}` : '';
      return `${HOST_API}/image/name/${filename.toString()}${query}`;
    }

    return '';
  }

  async fetchColor(): Promise<any> {
    return null;
  }
}
