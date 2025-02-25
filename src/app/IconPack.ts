import type { ServerIcon } from '@/entity/Server';

export class IconPack {
  readonly light: ServerIcon;
  readonly dark: ServerIcon;

  constructor(light: ServerIcon, dark: ServerIcon) {
    this.light = light;
    this.dark = dark;
  }
}
