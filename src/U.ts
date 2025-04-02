import { optString } from '@chanzor/utils';
import chroma from 'chroma-js';

export function optObject(obj: any, fallback = {}): {} {
  return typeof obj === 'object' ? obj : fallback;
}
export function optObjectOnly(obj: any, fallback = {}): {} {
  return typeof obj === 'object' && obj ? obj : fallback;
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
