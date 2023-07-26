import U from "@/U";
const config = require("@/../freshnet.config");

export default class IconHost {
  private name: string = "";
  private ext?: string = undefined;

  static url(name: string = "", ext: string | undefined = undefined): string {
    const pathname = !U.isString(ext) ? `icon/${name}` : `icon/${name}.${ext}`;
    return `${config.hostRes}/${pathname}`;
  }

  constructor(name: string = "", ext: string | undefined = undefined) {
    if (U.isString(name)) this.name = name;
    if (U.isString(ext)) this.ext = ext;
  }

  toUrl(): string {
    return IconHost.url(this.name, this.ext);
  }
  toName(): string {
    return this.name;
  }
}
