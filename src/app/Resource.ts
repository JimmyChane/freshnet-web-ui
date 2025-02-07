import { type IconAsset, optString, parseIcon, parseKey } from '@/U';

export class Resource {
  key: string;
  title: string;
  icon: IconAsset | null;

  constructor(value: Record<string, any>) {
    this.key = parseKey(value.key);
    this.title = optString(value.title);
    this.icon = parseIcon(value.icon);
  }
}
