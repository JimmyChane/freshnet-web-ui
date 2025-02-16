import { type IconAsset, optString, parseIcon, parseKey } from '@/U';
import type { ServerIcon } from '@/host/Server';

export class NavView {
  key: string = '';
  title: string = '';
  icon: IconAsset | null = null;

  setKey(key: string) {
    this.key = parseKey(key);
    return this;
  }
  setTitle(title: string) {
    this.title = optString(title);
    return this;
  }
  setIcon(icon: Record<string, ServerIcon>) {
    this.icon = parseIcon(icon);
    return this;
  }
}
