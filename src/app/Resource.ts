import { optString, parseIcon, parseKey, IconAsset } from "@/U";

export default class Resource {
  key: string;
  title: string;
  icon: IconAsset | null;

  constructor(value: Record<string, any>) {
    this.key = parseKey(value.key);
    this.title = optString(value.title);
    this.icon = parseIcon(value.icon);
  }
}
