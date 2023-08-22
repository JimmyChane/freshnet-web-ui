import U from "@/U";
import { objectToArray } from "./AppTool";

export default class RouteQuery {
  static isValidKey(key: string | any): boolean {
    return U.isString(key) && !key.includes(" ");
  }
  static isValidValue(value: any): boolean {
    return value !== null && value !== undefined && value !== "";
  }
  static replace(
    currentQuery: Record<string, any>,
    pendingQuery: Record<string, any>,
  ) {
    const nextQueries = objectToArray(currentQuery);
    const pendingQueries = objectToArray(pendingQuery);
    let isChanged = false;

    for (const pendingQuery of pendingQueries) {
      if (!U.isObjectOnly(pendingQuery)) continue;

      const { key, value } = pendingQuery;
      if (!this.isValidKey(key)) continue;

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

      if (!this.isValidValue(nextQuery.value)) {
        nextQueries.splice(nextQueries.indexOf(nextQuery), 1);
        isChanged = true;
        continue;
      }
    }

    if (!isChanged) return;

    return nextQueries
      .filter((nextQuery) => {
        return (
          this.isValidKey(nextQuery.key) && this.isValidValue(nextQuery.value)
        );
      })
      .reduce((query: Record<string, any>, nextQuery) => {
        query[nextQuery.key] = nextQuery.value;
        return query;
      }, {});
  }
}
