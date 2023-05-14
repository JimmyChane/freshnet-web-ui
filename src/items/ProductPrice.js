import Price from "@/objects/Price";

class ProductPrice {
   static Currency = Price.DefaultCurrency;

   stores = null;

   #price = null;

   constructor(stores) {
      this.stores = stores;
   }

   fromString(str) {
      const { currency, amount: value } = Price.parse(str);
      this.fromData({ currency, value });
      return this;
   }
   fromData(data = { currency: "", value: 0 }) {
      this.#price = new Price(data.value, data.currency);
      return this;
   }
   toData() {
      return {
         currency: this.#price.currency,
         value: this.#price.amount,
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
         value instanceof ProductPrice
            ? this.#price.plus(value.#price)
            : this.#price.plus(value);
      const data = { amount: price.amount, currency: price.currency };
      return new ServicePrice().fromData(data);
   }
   minus(value) {
      const price =
         value instanceof ProductPrice
            ? this.#price.minus(value.#price)
            : this.#price.minus(value);
      const data = { amount: price.amount, currency: price.currency };
      return new ServicePrice().fromData(data);
   }

   get value() {
      return this.#price?.amount ?? 0;
   }
   get currency() {
      return this.#price?.currency ?? "";
   }
}

export default ProductPrice;
