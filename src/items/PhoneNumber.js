import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
export default class PhoneNumber {
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    value = "";
    fromData(data) {
        this.value = data.value;
        return this;
    }
    toData() {
        return {
            value: this.value,
        };
    }
    toString() {
        let value = U.optString(this.value);
        const spliceString = (text, index, count = 1) => {
            if (count <= 0)
                return text;
            if (index === 0)
                return text.slice(index + count, text.length);
            if (text.length <= index + count)
                return text.slice(0, index);
            return text.slice(0, index) + text.slice(index + count, text.length);
        };
        for (let i = 0; i < value.length; i++) {
            let char = value.charAt(i);
            let number = Number.parseInt(char);
            if (Number.isNaN(number)) {
                value = spliceString(value, i);
                i--;
            }
        }
        return value;
    }
    toCount(strs) {
        return strs.reduce((count, str) => {
            if (ItemSearcher.textContains(this.value, str))
                count += 4;
            return count;
        }, 0);
    }
    isEqual(item) {
        return item.value === this.value;
    }
    compare(item) {
        return U.optString(this.value).localeCompare(U.optString(item.value));
    }
}
