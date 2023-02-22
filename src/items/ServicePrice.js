import Price from "@/objects/Price";

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
      return this.#price.toCount(strs);
   }
   toString() {
      return this.#price.toString();
   }

   compare(item) {
      return this.#price.compare(item.#price);
   }

   plus(value) {
      const price =
         value instanceof ServicePrice
            ? this.#price.plus(value.#price)
            : this.#price.plus(value);
      const data = { amount: price.amount, currency: price.currency };
      return new ServicePrice().fromData(data);
   }
   minus(value) {
      const price =
         value instanceof ServicePrice
            ? this.#price.minus(value.#price)
            : this.#price.minus(value);
      const data = { amount: price.amount, currency: price.currency };
      return new ServicePrice().fromData(data);
   }
}
