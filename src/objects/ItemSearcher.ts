import { isString } from '@/U';

export function textContains(text: String = '', keyword: string = ''): boolean {
  return (
    isString(text) && text.toLowerCase().replaceAll(' ', '').includes(keyword)
  );
}
