export default class TimeNowGetter {
  private last: number = 0;

  get(): number {
    this.last = 0;
    let now: number = Date.now();

    while (this.last >= now) {
      now++;
    }

    this.last = now;
    return now;
  }
}
