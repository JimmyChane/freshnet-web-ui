import U from "@/U";
const config = require("@/../freshnet.config");
export default class IconHost {
    name = "";
    ext = undefined;
    static url(name = "", ext = undefined) {
        const pathname = !U.isString(ext) ? `icon/${name}` : `icon/${name}.${ext}`;
        return `${config.hostRes}/${pathname}`;
    }
    constructor(name = "", ext = undefined) {
        if (U.isString(name))
            this.name = name;
        if (U.isString(ext))
            this.ext = ext;
    }
    toUrl() {
        return IconHost.url(this.name, this.ext);
    }
    toName() {
        return this.name;
    }
}
