import { isString } from "@/U";

export default class ItemSearcher {
  static textContains(text: String = "", keyword: string = ""): boolean {
    return (
      isString(text) && text.toLowerCase().replaceAll(" ", "").includes(keyword)
    );
  }
}
