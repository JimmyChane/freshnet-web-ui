import ProductPrice from "./ProductPrice";
class ProductPrices {
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    normal = null;
    promotion = null;
    fromData(data = {}) {
        this.normal = new ProductPrice(this.stores).fromString(data.normal || "");
        this.promotion = new ProductPrice(this.stores).fromString(data.promotion || "");
        return this;
    }
    toData() {
        return {
            normal: this.normal?.toString() ?? "",
            promotion: this.promotion?.toString() ?? "",
        };
    }
    toCount(strs) {
        return 0;
    }
    isEqual(item) {
        return this === item;
    }
    compare(item) {
        return 0;
    }
}
export default ProductPrices;
