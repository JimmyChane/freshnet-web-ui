import U from "@/U";
class SocketData {
    content;
    key;
    constructor(content = null, key = "") {
        this.content = content;
        key = U.optString(key);
        key = U.replaceStringAll(key, " ", "");
        if (key.length)
            this.key = key;
    }
}
export default SocketData;
