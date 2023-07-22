import U from "@/U";
export default class ItemSearcher {
    static textContains(text = "", keyword = "") {
        return (U.isString(text) &&
            text.toLowerCase().replaceAll(" ", "").includes(keyword));
    }
}
