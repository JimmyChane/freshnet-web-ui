import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
import Image from "./Image";
export class Type {
    static Key = {
        Processor: "processor",
        Ram: "ram",
        Size: "size",
        Storage: "storage",
        Resolution: "resolution",
        Display: "display",
        Monitor: "monitor",
        Graphic: "graphic",
        Keyboard: "keyboard",
        Backlight: "backlight",
        Stylus: "stylus",
        Camera: "camera",
        Battery: "battery",
        Speed: "speed",
        Wifi: "wifi",
        Bluetooth: "bluetooth",
        Print: "print",
        Scan: "scan",
        Paper: "paper",
        Ink: "ink",
        Connectivity: "connectivity",
        Colour: "colour",
        Os: "os",
    };
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    id = "";
    key = "";
    title = "";
    icon = null;
    color = "";
    fromData(data) {
        this.id = U.trimId(data._id || "");
        this.key = U.trimId(data.key || "");
        this.title = U.trimText(data.title || "");
        this.icon = U.isObjectOnly(data.icon)
            ? new Image().fromData(data.icon)
            : null;
        this.color = U.trimId(data.color || "");
        return this;
    }
    toData() {
        return {
            _id: U.trimId(this.id),
            key: U.trimId(this.key),
            title: U.trimText(this.title),
            icon: this.icon?.toData() ?? {},
            color: U.trimId(this.color),
        };
    }
    toCount(strs) {
        return strs.reduce((count, str) => {
            if (ItemSearcher.textContains(this.key, str))
                count++;
            if (ItemSearcher.textContains(this.title, str))
                count++;
            return count;
        }, 0);
    }
    compare(item) {
        return 0;
    }
    getUnique() {
        return this.id;
    }
}
export default class Specification {
    stores;
    specificationStore;
    typeKey = "";
    type = null;
    content = "";
    constructor(stores) {
        this.stores = stores;
        this.specificationStore = stores.specification;
    }
    fromData(data) {
        this.typeKey = U.trimId(data.key);
        this.content = U.trimText(data.content);
        this.fetchType();
        return this;
    }
    toData() {
        return {
            key: this.getKey(),
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
        if (this.type instanceof Type)
            return this.type;
        const specifications = await this.specificationStore.dispatch("getItems");
        const specification = specifications.find((specification) => {
            return specification.key == this.typeKey;
        });
        this.type = specification ?? null;
        return this.type;
    }
    getKey() {
        if (this.type instanceof Type) {
            return this.type.key;
        }
        if (typeof this.type === "string") {
            return this.typeKey;
        }
        return "";
    }
}
