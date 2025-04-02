import { optNumber } from '@chanzor/utils';

import { trimText } from '@/U';

// todo: copied
export interface ServiceBelongingData {
  title?: string;
  time?: number;
  quantity?: number;
  description?: string;
}

export class ServiceBelonging {
  title: string = '';
  time: number = 0;
  quantity: number = 1;
  description: string = '';

  fromData(data: any) {
    this.title = trimText(data.title);
    this.time = data.time;
    this.quantity = Math.max(optNumber(data.quantity), 1);
    this.description = trimText(data.description);
    return this;
  }
  toData(): any {
    return {
      title: trimText(this.title),
      time: this.time,
      quantity: Math.max(optNumber(this.quantity), 1),
      description: trimText(this.description),
    };
  }
}
