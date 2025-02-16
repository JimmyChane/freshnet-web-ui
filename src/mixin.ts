import { isObjectOnly, optString } from '@/U';

import type { AppRoute } from './router';

function getContextTitle<T extends string>(
  context: any,
  options: { title: T | (() => T) },
): string {
  let title = options.title;
  if (typeof title === 'function') {
    title = title.call(context);
  }
  return optString(title).trim();
}
function getContextColors<
  T extends {
    primary?: any;
    primaryLight?: any;
    primaryDark?: any;
    accent?: any;
  },
>(
  context: any,
  options: { color: T | (() => T) },
): { primary: any; primaryLight: any; primaryDark: any; accent: any } {
  let color = options.color;
  if (typeof color === 'function') {
    color = color.call(context);
  }
  color = typeof color === 'object' && color ? color : ({} as T);

  const {
    primary = '',
    primaryLight = '',
    primaryDark = '',
    accent = '',
  } = color;

  return { primary, primaryLight, primaryDark, accent };
}
function getContextIcons<T extends { light: any; dark: any; color: any }>(
  context: any,
  options: { icon: T | (() => T) },
): { light: any; dark: any; color: any } {
  let icon = options.icon;
  if (typeof icon === 'function') {
    icon = icon.call(context);
  }
  icon = isObjectOnly(icon) ? icon : ({} as T);

  const { light = '', dark = '', color = '' } = icon;

  return { light, dark, color };
}

export function onCreatedContext(context: any) {
  const getColors = () => getContextColors(context, context.$options);
  const getIcons = () => getContextIcons(context, context.$options);

  const title = getContextTitle(context, context.$options);

  if (title) {
    document.title = title;
  }
}
export function onCreatedRoute(context: AppRoute) {
  const title = optString(context.title).trim();

  if (title.length) {
    document.title = title;
  }
}
