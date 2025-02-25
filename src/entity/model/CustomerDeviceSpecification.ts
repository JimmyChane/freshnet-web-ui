import { trimId, trimText } from '@/U';

export class CustomerDeviceSpecification {
  typeKey: string = '';
  content: string = '';

  fromData(data: any): CustomerDeviceSpecification {
    this.typeKey = trimId(data.typeKey);
    this.content = trimText(data.content);

    return this;
  }
  toData(): any {
    return { typeKey: trimId(this.typeKey), content: trimText(this.content) };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  compare(item: CustomerDeviceSpecification): number {
    return 0;
  }
}
