import { optString, replaceStringAll } from '@/U';

export class SocketData {
  content: any | null;
  key?: string;

  constructor(content: any | null = null, key: string = '') {
    this.content = content;

    key = optString(key);
    key = replaceStringAll(key, ' ', '');
    if (key.length) this.key = key;
  }
}
