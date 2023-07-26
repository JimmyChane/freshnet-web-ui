import Image from "./Image";
import ItemSearcher from "../objects/ItemSearcher";
import U from "@/U";
export default class Brand {
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    id = "";
    title = "";
    icon = null;
    fromData(data) {
        this.id = U.trimId(data._id);
        this.title = U.trimText(data.title);
        this.icon = U.isObject(data.icon) ? new Image().fromData(data.icon) : null;
        return this;
    }
    toData() {
        return {
            _id: this.id,
            title: this.title,
            icon: this.icon?.toData() ?? {},
        };
    }
    toCount(strs) {
        return strs.reduce((count, str) => {
            if (ItemSearcher.textContains(this.title, str))
                count++;
            if (ItemSearcher.textContains(this.title, str))
                count++;
            return count;
        }, 0);
    }
    isEqual(obj) {
        return this.id === obj.id && this.title === obj.title;
    }
    compare(item) {
        return this.title.localeCompare(item.title);
    }
}
