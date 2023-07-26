export default class TimeNowGetter {
    last = 0;
    get() {
        this.last = 0;
        let now = Date.now();
        while (this.last >= now) {
            now++;
        }
        this.last = now;
        return now;
    }
}
