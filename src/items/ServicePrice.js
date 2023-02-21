import Price from "@/objects/Price";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

export default class ServicePrice {
   #price = null;

   get amount() {
      return this.#price.amount;
   }
   get currency() {
      return this.#price.currency;
   }

   fromData(data) {
      this.#price = new Price(data.amount, data.currency ? data.currency : "rm");
      return this;
   }
   toData() {
      return {
         amount: this.#price.amount,
         currency: this.#price.currency,
      };
   }
   toCount(strs) {
      return strs.reduce((count, str) => count + textContains(this.toString(), str), 0);
   }
   toString() {
      return this.#price.toString();
   }

   plus(value) {
      const price =
         value instanceof ServicePrice
            ? this.#price.plus(value.#price)
            : this.#price.plus(value);

      return new ServicePrice().fromData({
         amount: price.amount,
         currency: price.currency,
      });
   }

   compare(item) {
      return this.#price.compare(item.#price);
   }
}
