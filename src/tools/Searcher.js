import U from "@/U";

export default class Searcher {
   static withItems(items = []) {
      const searcher = new Searcher();
      searcher.items = items;
      return searcher;
   }

   items = [];

   constructor() {}

   onSplitStrings(strs = [""]) {
      return strs.reduce((strs, str) => {
         for (const parsedStr of this.onSplitString(str)) {
            if (!strs.includes(parsedStr)) strs.push(parsedStr);
         }

         return strs;
      }, []);
   }
   onSplitString(str = "") {
      return str
         .toLowerCase()
         .split(/[\s,]+/)
         .filter((text) => text);
   }
   onCountItems(items = [{ toCount: (strs = [""]) => 0 }], strs = [""]) {
      return items.reduce((results, item) => {
         try {
            const result = this.onCountItem(item, strs);
            if (result.count > 0) results.push(result);
         } catch (error) {
            console.error("skip search item", error);
         }
         return results;
      }, []);
   }
   onCountItem(item = { toCount: (strs = [""]) => 0 }, strs = [""]) {
      return { count: item.toCount(strs), item };
   }
   onFilterResults(results = [{ count: 0 }]) {
      if (results.length <= 30) return results;

      let highestCount = 0;
      for (const result of results) {
         if (result.count > highestCount) highestCount = result.count;
      }

      const minCount = highestCount * 0.5;
      results = results.filter((result) => result.count <= minCount);

      return this.onFilterResults(results);
   }
   onSortResults(results = [{ count: 0 }]) {
      return results.sort((result1, result2) => result2.count - result1.count);
   }

   search(str = "") {
      if (!U.isString(str)) return [];

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
