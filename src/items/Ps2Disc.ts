import { trimId, trimText } from '@/U';
import type { Item } from '@/stores/tools/List';

import { textContains } from '../objects/ItemSearcher';

export class Ps2Disc implements Item {
  id: string = '';
  code: string = '';
  title: string = '';

  fromData(data: any) {
    this.id = trimId(data._id);
    this.code = trimId(data.code);
    this.title = trimText(data.title);
    return this;
  }
  toData(): any {
    return {
      _id: trimId(this.id),
      code: trimId(this.code),
      title: trimText(this.title),
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains('ps2', str)) count++;
      if (textContains('disc', str)) count++;
      if (textContains(this.code, str)) count++;
      if (textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Ps2Disc): number {
    return this.title.localeCompare(item.title);
  }

  getUnique(): string {
    return this.id;
  }
}
