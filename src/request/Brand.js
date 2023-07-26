import HostApi from "@/host/HostApi";
export default class Brand {
    static list() {
        return HostApi.request().url("brand/").send();
    }
}
