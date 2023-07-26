import Price from "@/objects/Price";
export default class ProductPrice {
    static Currency = Price.DefaultCurrency;
    stores;
    price = null;
    constructor(stores) {
        this.stores = stores;
    }
    fromString(str) {
        const { currency, amount: value } = Price.parse(str);
        this.fromData({ currency, value });
        return this;
    }
    fromData(data = { currency: "", value: 0 }) {
        this.price = new Price(data.value, data.currency);
        return this;
    }
    toData() {
        return {
            currency: this.price?.currency ?? "",
            value: this.price?.amount ?? 0,
        };
    }
    toCount(strs) {
        return this.price?.toCount(strs) ?? 0;
    }
    toString() {
        return this.price?.toString() ?? "";
    }
    compare(item) {
        return this.price?.compare(item.price ?? new Price()) ?? 0;
    }
    plus(value) {
        const price = value instanceof ProductPrice
            ? this.price?.plus(value.price) ?? new Price(0, "")
            : this.price?.plus(value) ?? new Price(0, "");
        const data = { value: price.amount, currency: price.currency };
        return new ProductPrice(this.stores).fromData(data);
    }
    minus(value) {
        const price = value instanceof ProductPrice
            ? this.price?.minus(value.price) ?? new Price(0, "")
            : this.price?.minus(value) ?? new Price(0, "");
        const data = { value: price.amount, currency: price.currency };
        return new ProductPrice(this.stores).fromData(data);
    }
    get value() {
        return this.price?.amount ?? 0;
    }
    get currency() {
        return this.price?.currency ?? "";
    }
}
