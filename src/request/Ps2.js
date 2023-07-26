import HostApi from "@/host/HostApi";
export default class Ps2 {
    static listDisc() {
        return HostApi.request().url("ps2/disc/").send();
    }
}
