import Price from "@/objects/Price";
export default class ServicePrice {
    price = null;
    get amount() {
        return this.price?.amount ?? 0;
    }
    get currency() {
        return this.price?.currency ?? "rm";
    }
    fromData(data) {
        this.price = new Price(data.amount, data.currency ?? "rm");
        return this;
    }
    toData() {
        return {
            amount: this.price?.amount ?? 0,
            currency: this.price?.currency ?? "rm",
        };
    }
    toCount(strs) {
        return this.price?.toCount(strs) ?? 0;
    }
    toString() {
        return this.price?.toString() ?? "";
    }
    compare(item) {
        if (!item.price)
            return 0;
        return this.price?.compare(item.price) ?? 0;
    }
    plus(value) {
        const price = value instanceof ServicePrice
            ? this.price?.plus(value.price)
            : this.price?.plus(value);
        const data = {
            amount: price?.amount ?? 0,
            currency: price?.currency ?? "rm",
        };
        return new ServicePrice().fromData(data);
    }
    minus(value) {
        const price = value instanceof ServicePrice
            ? this.price?.minus(value.price)
            : this.price?.minus(value);
        const data = {
            amount: price?.amount ?? 0,
            currency: price?.currency ?? "rm",
        };
        return new ServicePrice().fromData(data);
    }
}
