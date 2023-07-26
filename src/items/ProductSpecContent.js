import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
const textContains = ItemSearcher.textContains;
import ProductSpecType from "@/items/ProductSpecType";
export default class ProductSpecContent {
    stores;
    specificationStore;
    constructor(stores) {
        this.stores = stores;
        this.specificationStore = stores.specification;
    }
    content = "";
    type = "";
    typeKey = "";
    fromData(data) {
        this.type = U.trimId(data.key);
        this.typeKey = this.type;
        this.content = U.trimText(data.content);
        this.fetchType();
        return this;
    }
    toData() {
        return {
            key: this.type instanceof ProductSpecType
                ? this.type.key
                : typeof this.typeKey === "string"
                    ? this.typeKey
                    : undefined,
            content: this.content,
        };
    }
    toCount(strs) {
        return strs.reduce((count, str) => {
            if (textContains(this.content, str))
                count++;
            return count;
        }, 0);
    }
    compare(item) {
        return 0;
    }
    async fetchType() {
        if (!U.isString(this.type))
            return this.type;
        const specifications = await this.specificationStore.dispatch("getItems");
        const specification = specifications.find((spec) => {
            return spec.key == this.typeKey;
        });
        this.type = specification ?? null;
        return this.type;
    }
}
