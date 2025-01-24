import { isObject, trimId, trimStringAll } from '@/U';
import BgCartridge from '@/assets/bg/177364729-w300h100.webp';
import BgNotebook from '@/assets/bg/andras-vas-Bd7gNnWJBkU-unsplash-w300h100.webp';
import BgOther from '@/assets/bg/christopher-bill-3l19r5EOZaw-unsplash-w300h100.webp';
import BgTablet from '@/assets/bg/daniel-romero--cCxgKIA5RA-unsplash-w300h100.webp';
import BgStorage from '@/assets/bg/denny-muller-1qL31aacAPA-unsplash-w300h100.webp';
import BgWebcam from '@/assets/bg/emiliano-cicero-lq87UxGSiEQ-unsplash-w300h100.webp';
import BgKeyboard from '@/assets/bg/girl-with-red-hat-Z6SXt1v5tP8-unsplash-w300h100.webp';
import BgRam from '@/assets/bg/harrison-broadbent-ING1Uf1Fc30-unsplash-w300h100.webp';
import BgNetwork from '@/assets/bg/jordan-harrison-40XgDxBfYXM-unsplash-w300h100.webp';
import BgAudio from '@/assets/bg/josh-sorenson-u8-QI4tRES0-unsplash-w300h100.webp';
import BgPrinter from '@/assets/bg/mahrous-houses-5AoOejjRUrA-unsplash-w300h100.webp';
import BgCctv from '@/assets/bg/michal-jakubowski-oQD9uq4Rd4I-unsplash-w300h100.webp';
import BgMonitor from '@/assets/bg/monitor-u3223qe-gallery-3-w300h100.webp';
import BgDesktop from '@/assets/bg/niclas-illg-wzVQp_NRIHg-unsplash-w300h100.webp';
import BgMouse from '@/assets/bg/ryan-putra-j4PqlNVZ4Bc-unsplash-w300h100.webp';
import { Item } from '@/stores/tools/List';

import ItemSearcher from '../objects/ItemSearcher';
import Image from './Image';

export const TABLET_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgTablet,
});
export const NOTEBOOK_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgNotebook,
});
export const DESKTOP_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgDesktop,
});
export const PRINTER_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgPrinter,
});
export const CARTRIDGE_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgCartridge,
});
export const MOUSE_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgMouse,
});
export const KEYBOARD_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgKeyboard,
});
export const AUDIO_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgAudio,
});
export const MONITOR_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgMonitor,
});
export const WEBCAM_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgWebcam,
});
export const CCTV_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgCctv,
});
export const STORAGE_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgStorage,
});
export const RAM_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgRam,
});
export const NETWORK_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgNetwork,
});
export const OTHER_CATEGORY_BACKGROUND = new Image().fromData({
  method: 'link',
  path: BgOther,
});

export function getCategoryBackground(key: string): Image | null {
  switch (key) {
    case CategoryKey.Tablet:
      return TABLET_CATEGORY_BACKGROUND;
    case CategoryKey.Notebook:
      return NOTEBOOK_CATEGORY_BACKGROUND;
    case CategoryKey.Desktop:
      return DESKTOP_CATEGORY_BACKGROUND;
    case CategoryKey.Printer:
      return PRINTER_CATEGORY_BACKGROUND;
    case CategoryKey.Cartridge:
      return CARTRIDGE_CATEGORY_BACKGROUND;
    case CategoryKey.Mouse:
      return MOUSE_CATEGORY_BACKGROUND;
    case CategoryKey.Keyboard:
      return KEYBOARD_CATEGORY_BACKGROUND;
    case CategoryKey.Audio:
      return AUDIO_CATEGORY_BACKGROUND;
    case CategoryKey.Monitor:
      return MONITOR_CATEGORY_BACKGROUND;
    case CategoryKey.Webcam:
      return WEBCAM_CATEGORY_BACKGROUND;
    case CategoryKey.Cctv:
      return CCTV_CATEGORY_BACKGROUND;
    case CategoryKey.Storage:
      return STORAGE_CATEGORY_BACKGROUND;
    case CategoryKey.Ram:
      return RAM_CATEGORY_BACKGROUND;
    case CategoryKey.Network:
      return NETWORK_CATEGORY_BACKGROUND;
    case CategoryKey.Other:
      return OTHER_CATEGORY_BACKGROUND;
    default:
      return null;
  }
}

export enum CategoryKey {
  Tablet = 'tablet',
  Notebook = 'laptop',
  Desktop = 'desktopComputer',
  Printer = 'printer',
  Cartridge = 'cartridge',
  Mouse = 'mouse',
  Keyboard = 'keyboard',
  Audio = 'audio',
  Monitor = 'monitor',
  Webcam = 'webcam',
  Cctv = 'cctv-camera',
  Storage = 'storage',
  Ram = 'ram',
  Network = 'network',
  Charger = 'charger',
  Other = 'other',
}

interface CategoryData {
  _id: string;
  key: string;
  title: string;
  icon?: any;
  background?: any;
}

export default class Category implements Item {
  stores: any = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  id: string = '';
  key: string = '';
  title: string = '';
  icon: Image | null = null;
  background: Image | null = null;

  fromData(data: CategoryData): this {
    this.id = trimId(data._id);
    this.key = trimId(data.key);
    this.title = trimStringAll(data.title);
    this.icon = isObject(data.icon) ? new Image().fromData(data.icon) : null;
    this.background = getCategoryBackground(this.key);

    return this;
  }

  toData(): CategoryData {
    return {
      _id: this.id,
      key: this.key,
      title: this.title,
      icon: this.icon?.toData() ?? {},
      background: this.background?.toData() ?? {},
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (this.title === 'Notebook')
        count += ItemSearcher.textContains('Laptop', str) ? 1 : 0;
      if (this.title === 'Notebook' && ItemSearcher.textContains('Laptop', str))
        count++;
      if (ItemSearcher.textContains(this.title, str)) count++;
      if (ItemSearcher.textContains('category', str)) count++;
      return count;
    }, 0);
  }

  compare(item: Category): number {
    const keyOrders = Object.values(CategoryKey) as string[];

    let index1 = keyOrders.indexOf(this.key);
    let index2 = keyOrders.indexOf(item.key);
    index1 = index1 == -1 ? keyOrders.length : index1;
    index2 = index2 == -1 ? keyOrders.length : index2;

    return index1 > index2 ? 1 : index1 < index2 ? -1 : 0;
  }

  getUnique(): string {
    return this.id;
  }
}
