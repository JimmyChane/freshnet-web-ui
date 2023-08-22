import U from "@/U";
import { parseIcon, parseKey, IconAsset } from "./AppTool";

export default class Resource {
  key: string;
  title: string;
  icon: IconAsset | null;

  constructor(value: Record<string, any>) {
    this.key = parseKey(value.key);
    this.title = U.optString(value.title);
    this.icon = parseIcon(value.icon);
  }
}
