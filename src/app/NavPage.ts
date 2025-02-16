import { type IconAsset, optString, parseIcon, parseKey } from '@/U';
import type { ServerIcon } from '@/host/Server';

import { NavViewGroup } from './NavViewGroup';

export class NavPage {
  key: string = '';
  title: string = '';
  icon: IconAsset | null = null;
  userPermissions: unknown[] = [];
  groups: NavViewGroup[] = [];

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
  setUserPermissions(userPermissions: unknown[]) {
    this.userPermissions = userPermissions;
    return this;
  }
  setGroups(groups: NavViewGroup[]) {
    this.groups = groups;
    return this;
  }
}
