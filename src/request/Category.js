import HostApi from "@/host/HostApi";
export default class Category {
    static list() {
        return HostApi.request().url("productv2/category/list/").send();
    }
}
