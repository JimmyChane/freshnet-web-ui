import { isObjectOnly, trimId, trimText } from '@/U';
import { textContains } from '@/objects/ItemSearcher';
import { Item } from '@/stores/tools/List';

import Image from './Image';

export enum SpecificationKey {
  Processor = 'processor',
  Ram = 'ram',
  Size = 'size',
  Storage = 'storage',
  Resolution = 'resolution',
  Display = 'display',
  Monitor = 'monitor',
  Graphic = 'graphic',

  Keyboard = 'keyboard',
  Backlight = 'backlight',
  Stylus = 'stylus',
  Camera = 'camera',
  Battery = 'battery',

  Speed = 'speed',
  Wifi = 'wifi',
  Bluetooth = 'bluetooth',

  Print = 'print',
  Scan = 'scan',
  Paper = 'paper',
  Ink = 'ink',
  Connectivity = 'connectivity',

  Colour = 'colour',
  Os = 'os',
}

export class Type implements Item {
  stores: any;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = '';
  key: string = '';
  title: string = '';
  icon: Image | null = null;
  color: string = '';

  fromData(data: {
    _id?: string;
    key?: string;
    title?: string;
    icon?: any;
    color?: string;
  }): Type {
    this.id = trimId(data._id || '');
    this.key = trimId(data.key || '');
    this.title = trimText(data.title || '');
    this.icon = isObjectOnly(data.icon)
      ? new Image().fromData(data.icon)
      : null;
    this.color = trimId(data.color || '');

    return this;
  }
  toData(): {
    _id: string;
    key: string;
    title: string;
    icon: any;
    color: string;
  } {
    return {
      _id: trimId(this.id),
      key: trimId(this.key),
      title: trimText(this.title),
      icon: this.icon?.toData() ?? {},
      color: trimId(this.color),
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.key, str)) count++;
      if (textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Type): number {
    return 0;
  }

  getUnique(): string {
    return this.id;
  }
}

export default class Specification {
  stores: any;
  specificationStore: any;

  typeKey: string = '';
  type: Type | null = null;
  content: string = '';

  constructor(stores: any) {
    this.stores = stores;
    this.specificationStore = stores.specification;
  }

  fromData(data: { key?: string; content?: string }): Specification {
    this.typeKey = trimId(data.key);
    this.content = trimText(data.content);
    this.fetchType();

    return this;
  }
  toData(): { key: string | undefined; content: string } {
    return {
      key: this.getKey(),
      content: this.content,
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.content, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Specification): number {
    return 0;
  }

  async fetchType(): Promise<Type | null> {
    if (this.type instanceof Type) return this.type;

    const specifications: Type[] =
      await this.specificationStore.dispatch('getItems');
    const specification = specifications.find((specification) => {
      return specification.key == this.typeKey;
    });
    this.type = specification ?? null;
    return this.type;
  }

  getKey(): string {
    if (this.type instanceof Type) {
      return this.type.key;
    }
    if (typeof this.type === 'string') {
      return this.typeKey;
    }
    return '';
  }
}
