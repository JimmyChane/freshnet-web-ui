import U from "@/U";
import { IconAsset, parseIcon, parseKey } from "./AppTool";
import { Icon } from "@/host/ServerResource";

export default class NavView {
  key: string = "";
  title: string = "";
  icon: IconAsset | null = null;

  setKey(key: string) {
    this.key = parseKey(key);
    return this;
  }
  setTitle(title: string) {
    this.title = U.optString(title);
    return this;
  }
  setIcon(icon: Record<string, Icon>) {
    this.icon = parseIcon(icon);
    return this;
  }
}
