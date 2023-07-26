import U from "@/U";

class SocketData {
  content: any | null;
  key?: string;

  constructor(content: any | null = null, key: string = "") {
    this.content = content;

    key = U.optString(key);
    key = U.replaceStringAll(key, " ", "");
    if (key.length) this.key = key;
  }
}

export default SocketData;
