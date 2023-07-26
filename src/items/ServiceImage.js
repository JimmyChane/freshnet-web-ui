import HostApi from "@/host/HostApi";
import U from "@/U";
import Filename from "../objects/Filename";
import Image from "./Image";
export default class ServiceImage {
    stores;
    loginStore;
    constructor(stores) {
        this.stores = stores;
        this.loginStore = stores.login;
    }
    name = "";
    path = "";
    method = "";
    storageType = "";
    fromData(data) {
        const image = new Image().fromData({
            path: data.path,
            method: data.method,
        });
        this.name = U.trimId(data.name);
        this.path = image.path;
        this.method = image.method;
        this.storageType = U.trimId(data.storageType);
        return this;
    }
    toData() {
        const image = new Image()
            .fromData({ path: this.path, method: this.method })
            .toData();
        return {
            name: U.trimId(this.name),
            path: image.path,
            method: image.method,
            storageType: U.trimId(this.storageType),
        };
    }
    toCount(strs) {
        return 0;
    }
    toUrl(option = { width: 0, height: 0 }) {
        const { width = 0, height = 0 } = option;
        const { path, method } = this;
        const dimensionQuery = Image.dimensionToQuery(width, height);
        const query = dimensionQuery.length ? `?${dimensionQuery}` : "";
        if (method === Image.Method.StorageImage) {
            const prefix = "/api/image/name/";
            const name = path.substring(prefix.length, path.length);
            const filename = new Filename(name);
            return `${HostApi.originApi}/image/name/${filename.toString()}${query}`;
        }
        const filename = new Filename(this.name);
        return `${HostApi.originApi}/service_v2/get/image/${filename.toString()}${query}`;
    }
    async toBlob(option = { width: 0, height: 0 }) {
        const { width = 0, height = 0 } = option;
        const url = this.toUrl({ width, height });
        const options = {
            headers: { authorization: this.loginStore.getters.token },
        };
        const response = await fetch(url, options);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }
}
