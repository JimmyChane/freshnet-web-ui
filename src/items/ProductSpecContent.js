import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
import ProductSpecType from "@/items/ProductSpecType";
export default class ProductSpecContent {
    stores;
    specificationStore;
    content = "";
    type = "";
    typeKey = "";
    constructor(stores) {
        this.stores = stores;
        this.specificationStore = stores.specification;
    }
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
            if (ItemSearcher.textContains(this.content, str))
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
    getKey() {
        return this.type instanceof ProductSpecType
            ? this.type.key
            : typeof this.type === "string"
                ? this.type
                : "";
    }
}
