import U from "@/U";
import Server from "@/host/Server";
import { Icon } from "@/host/ServerResource";
import User from "@/items/User";
import NavViewGroup from "./NavViewGroup";

export interface IconAsset {
  light: string;
  dark: string;
}
export interface Parse {
  key: string;
  value: any;
}
export interface GroupAsset {
  key: string;
  title: string;
  icon: string;
  values: any[];
  children: any[];
  userPermissions: any[];
}

export function objectToArray<T>(object: Record<string, T> | any): Parse[] {
  return Object.keys(typeof object === "object" ? object : {}).map((key) => {
    return {
      key,
      value: object[key],
    };
  });
}
export function isPassed(user: User, permissions: any[] | any) {
  permissions = Array.isArray(permissions) ? permissions : [];

  if (permissions.length > 0) {
    if (user.isTypeAdmin() && !permissions.includes("admin")) return false;
    if (user.isTypeStaff() && !permissions.includes("staff")) return false;
  }

  return true;
}
export function parseIcon(icon: Record<string, Icon> | any): IconAsset | null {
  if (!U.isObjectOnly(icon)) return null;

  const light =
    icon.light instanceof Icon
      ? icon.light.toUrl()
      : Server.icon(icon.light).toUrl();
  const dark =
    icon.dark instanceof Icon
      ? icon.dark.toUrl()
      : Server.icon(icon.dark).toUrl();

  return { light, dark };
}
export function parseKey(str: string | any) {
  return U.optString(str).trim().replace(" ", "");
}
export function parseGroup2s(array: GroupAsset[]): NavViewGroup[] {
  return U.optArray(array).map((obj: GroupAsset) => {
    return new NavViewGroup()
      .setKey(obj.key)
      .setTitle(obj.title)
      // .setTitle(`${obj.title} hello`)
      .setIcon(obj.icon)
      .setValues(obj.values)
      .setChildren(obj.children)
      .setUserPermissions(obj.userPermissions);
  });
}
