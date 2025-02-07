export function textContains(text: String = '', keyword: string = ''): boolean {
  if (typeof text !== 'string') return false;

  let parsed = text;

  while (parsed.includes(' ')) {
    parsed = parsed.replace(' ', '');
  }

  return parsed.toLowerCase().includes(keyword);
}
