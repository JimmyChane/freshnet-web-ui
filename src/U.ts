import chroma from 'chroma-js';

import { ServerIcon } from '@/host/Server';
import { User } from '@/items/User';

import { NavViewGroup } from './app/NavViewGroup';

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

export function isString(str: any): boolean {
  return typeof str === 'string';
}
export function isNumber(num: any): boolean {
  return typeof num === 'number' && !Number.isNaN(num);
}
export function isBoolean(bool: any): boolean {
  return typeof bool === 'boolean';
}
export function isArray(arr: any): boolean {
  return Array.isArray(arr);
}
export function isObject(obj: any): boolean {
  return typeof obj === 'object';
}
export function isObjectOnly(obj: any): boolean {
  return isObject(obj) && obj;
}
export function isFunction(fun: any): boolean {
  return typeof fun === 'function';
}

export function optString(str: any, fallback = ''): string {
  return isString(str) ? str : fallback;
}
export function optNumber(num: any, fallback = 0): number {
  return isNumber(num) ? num : fallback;
}
export function optBoolean(bool: any, fallback = false): boolean {
  return isBoolean(bool) ? bool : fallback;
}
export function optArray<T>(arr: T[] | undefined, fallback: T[] = []): T[] {
  if (arr === undefined) return fallback;
  return Array.isArray(arr) ? arr : fallback;
}
export function optObject(obj: any, fallback = {}): {} {
  return isObject(obj) ? obj : fallback;
}
export function optObjectOnly(obj: any, fallback = {}): {} {
  return isObjectOnly(obj) ? obj : fallback;
}

export function trimId(str: any): string {
  return replaceStringAll(str, ' ', '');
}
export function trimText(str: any): string {
  return replaceStringAll(str, '  ', ' ').trim();
}
export function trimStringAll(str = '', fallback = ''): string {
  str = trimText(str);
  return str.length ? str : fallback;
}
export function replaceStringAll(str = '', regex = '', replace = ''): string {
  str = optString(str);
  regex = optString(regex);
  replace = optString(replace);

  if (regex === replace) return str;

  while (str.includes(regex)) {
    str = str.replace(regex, replace);
  }

  return str;
}

export function isColorDark(color: any, threshold = 60): boolean {
  return chroma.deltaE(color, '000000') < threshold;
}

export function objectToArray<T>(object: Record<string, T> | any): Parse[] {
  return Object.keys(typeof object === 'object' ? object : {}).map((key) => {
    return { key, value: object[key] };
  });
}
export function isPassed(user: User, permissions: any[] | any) {
  permissions = Array.isArray(permissions) ? permissions : [];

  if (permissions.length > 0) {
    if (user.isTypeAdmin() && !permissions.includes('admin')) return false;
    if (user.isTypeStaff() && !permissions.includes('staff')) return false;
  }

  return true;
}
export function parseIcon(
  icon: Record<string, ServerIcon> | any,
): IconAsset | null {
  if (!isObjectOnly(icon)) return null;

  const light =
    icon.light instanceof ServerIcon
      ? icon.light.toUrl()
      : new ServerIcon(icon.light).toUrl();
  const dark =
    icon.dark instanceof ServerIcon
      ? icon.dark.toUrl()
      : new ServerIcon(icon.dark).toUrl();

  return { light, dark };
}
export function parseKey(str: string | any) {
  return optString(str).trim().replace(' ', '');
}
export function parseGroup2s(array: GroupAsset[]): NavViewGroup[] {
  return optArray(array).map((obj: GroupAsset) => {
    return (
      new NavViewGroup()
        .setKey(obj.key)
        .setTitle(obj.title)
        // .setTitle(`${obj.title} hello`)
        .setIcon(obj.icon)
        .setValues(obj.values)
        .setChildren(obj.children)
        .setUserPermissions(obj.userPermissions)
    );
  });
}

export function isValidKey(key: string | any): boolean {
  return isString(key) && !key.includes(' ');
}
export function isValidValue(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}
export function replace(
  currentQuery: Record<string, any>,
  pendingQuery: Record<string, any>,
) {
  const nextQueries = objectToArray(currentQuery);
  const pendingQueries = objectToArray(pendingQuery);
  let isChanged = false;

  for (const pendingQuery of pendingQueries) {
    if (!isObjectOnly(pendingQuery)) continue;

    const { key, value } = pendingQuery;
    if (!isValidKey(key)) continue;

    const nextQuery = nextQueries.find((nextQuery) => {
      return nextQuery.key === key;
    });

    if (!nextQuery) {
      nextQueries.push({ key, value });
      isChanged = true;
      continue;
    }

    if (nextQuery.value !== pendingQuery.value) {
      nextQuery.value = pendingQuery.value;
      isChanged = true;
      continue;
    }

    if (!isValidValue(nextQuery.value)) {
      nextQueries.splice(nextQueries.indexOf(nextQuery), 1);
      isChanged = true;
      continue;
    }
  }

  if (!isChanged) return;

  return nextQueries
    .filter((nextQuery) => {
      return isValidKey(nextQuery.key) && isValidValue(nextQuery.value);
    })
    .reduce((query: Record<string, any>, nextQuery) => {
      query[nextQuery.key] = nextQuery.value;
      return query;
    }, {});
}
