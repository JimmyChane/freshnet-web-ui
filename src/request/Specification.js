import HostApi from "@/host/HostApi";
export default class Specification {
    static list() {
        return HostApi.request().url("spec/").send();
    }
}
