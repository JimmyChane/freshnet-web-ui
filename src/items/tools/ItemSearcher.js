import U from "@/U";

class ItemSearcher {
   static textContains(text, keyword) {
      return (
         U.isString(text) &&
         text.toLowerCase().replaceAll(" ", "").includes(keyword)
      );
   }
}

export default ItemSearcher;
