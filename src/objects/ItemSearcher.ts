import U from "@/U";

export default class ItemSearcher {
  static textContains(text: String = "", keyword: string = ""): boolean {
    return (
      U.isString(text) &&
      text.toLowerCase().replaceAll(" ", "").includes(keyword)
    );
  }
}
