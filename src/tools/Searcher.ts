import { isString } from '@/U';

interface SearchResult {
  count: number;
  item: { toCount(strs: string[]): number };
}

export function withItems(items: { toCount(strs: string[]): number }[] = []) {
  const searcher = new Searcher();
  searcher.items = items;
  return searcher;
}

export class Searcher {
  items: { toCount(strs: string[]): number }[] = [];

  constructor() {}

  onSplitStrings(strs: string[] = []): string[] {
    return strs.reduce((strs: string[], str: string) => {
      for (const parsedStr of this.onSplitString(str)) {
        if (!strs.includes(parsedStr)) {
          strs.push(parsedStr);
        }
      }

      return strs;
    }, []);
  }

  onSplitString(str: string = ''): string[] {
    return str
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((text) => text);
  }

  onCountItems(
    items: { toCount(strs: string[]): number }[] = [],
    strs: string[] = [],
  ): SearchResult[] {
    return items.reduce((results, item) => {
      try {
        const result = this.onCountItem(item, strs);
        if (result.count > 0) results.push(result);
      } catch (error) {
        console.error('skip search item', error);
      }
      return results;
    }, [] as SearchResult[]);
  }

  onCountItem(
    item: { toCount(strs: string[]): number },
    strs: string[],
  ): SearchResult {
    return { count: item.toCount(strs), item };
  }

  onFilterResults(results: SearchResult[]): SearchResult[] {
    if (results.length <= 30) return results;

    let highestCount = 0;
    for (const result of results) {
      if (result.count > highestCount) highestCount = result.count;
    }

    const minCount = highestCount * 0.5;
    results = results.filter((result) => result.count <= minCount);

    return this.onFilterResults(results);
  }

  onSortResults(results: SearchResult[]): SearchResult[] {
    return results.sort((result1, result2) => result2.count - result1.count);
  }

  search(str: string | string[]): { toCount(strs: string[]): number }[] {
    if (!isString(str)) return [];

    const strs = Array.isArray(str)
      ? this.onSplitStrings(str)
      : this.onSplitString(str);
    const results = this.onCountItems(this.items, strs);
    const sortedResults = this.onSortResults(results);

    if (sortedResults.length < 40) {
      return sortedResults.map((result) => result.item);
    }
    const items = [];
    for (let i = 0; i < 40; i++) {
      items.push(sortedResults[i].item);
    }
    return items;
  }
}
