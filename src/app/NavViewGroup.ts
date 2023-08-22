import U from "@/U";
import { parseKey } from "./AppTool";
import NavView from "./NavView";

export default class NavViewGroup {
  key: string = "";
  title: string = "";
  icon: unknown = "";
  values: unknown[] = [];
  children: unknown;
  userPermissions: unknown[] = [];
  isLink: boolean = false;
  isQuery: boolean = false;
  groups: NavView[] = [];

  setKey(key: string) {
    this.key = parseKey(key);
    return this;
  }
  setTitle(title: string) {
    this.title = U.optString(title);
    return this;
  }
  setIcon(icon: unknown) {
    this.icon = icon;
    return this;
  }
  setValues(values: unknown[]) {
    this.values = U.optArray(values);
    return this;
  }
  setChildren(children: unknown) {
    this.children = children;

    if (Array.isArray(children)) {
      this.values.unshift(...children);
    }

    return this;
  }
  setUserPermissions(userPermissions: unknown[]) {
    this.userPermissions = userPermissions;
    return this;
  }

  setIsLink(isLink: boolean) {
    this.isLink = isLink;
    return this;
  }
  setIsQuery(isQuery: boolean){
    this.isQuery = isQuery;
    return this;
  }

  setGroups(groups: NavView[]){
    this.groups = groups;
    return this;
  }
}
