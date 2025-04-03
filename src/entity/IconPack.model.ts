import type { ServerIconModel } from '@/entity/ServerIcon.model';

export class IconPackModel {
  readonly light: ServerIconModel;
  readonly dark: ServerIconModel;

  constructor(light: ServerIconModel, dark: ServerIconModel) {
    this.light = light;
    this.dark = dark;
  }
}
