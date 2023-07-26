import { isAfter, isBefore, format, parse, isSameDay } from "date-fns";

class WorkingHours {
  stores: any;
  parentDay: string = "";

  constructor(stores: any, day: string = "") {
    this.stores = stores;
    this.parentDay = day;
  }

  private formatString: string = "h:mmaaa";

  private timeStart: string = "";
  private timeEnd: string = "";

  private dateStart: Date = new Date();
  private dateEnd: Date = new Date();

  fromData(data: any): WorkingHours {
    const { timeStart, timeEnd } = data;

    const now = new Date();
    const dateHourStart = parse(
      `${this.parentDay}${timeStart}`,
      `ccccHHmm`,
      now,
    );
    const dateHourEnd = parse(`${this.parentDay}${timeEnd}`, `ccccHHmm`, now);

    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.dateStart = dateHourStart;
    this.dateEnd = dateHourEnd;

    return this;
  }
  toData(): any {
    return { timeStart: this.timeStart, timeEnd: this.timeEnd };
  }
  toCount(strs: string[]): number {
    return 0;
  }
  compare(item: WorkingHours): number {
    return 0;
  }

  getDateStart(): Date {
    return this.dateStart;
  }
  getDateEnd(): Date {
    return this.dateEnd;
  }

  toString(): string {
    const timeStart = format(this.dateStart, this.formatString);
    const timeEnd = format(this.dateEnd, this.formatString);
    return `${timeStart} - ${timeEnd}`;
  }
  isSameDay(date: Date): boolean {
    return isSameDay(this.dateStart, date) && isSameDay(this.dateStart, date);
  }
  isBetween(date: Date): boolean {
    return this.isStartAfter(date) && this.isEndBefore(date);
  }
  isAfter(date: Date): boolean {
    return this.isStartAfter(date) && this.isEndAfter(date);
  }
  isBefore(date: Date): boolean {
    return this.isStartBefore(date) && this.isEndBefore(date);
  }

  isStartBefore(date: Date): boolean {
    return isBefore(date, this.dateStart);
  }
  isStartAfter(date: Date): boolean {
    return isAfter(date, this.dateStart);
  }
  isEndBefore(date: Date): boolean {
    return isBefore(date, this.dateEnd);
  }
  isEndAfter(date: Date): boolean {
    return isAfter(date, this.dateEnd);
  }
}

class WorkingDay {
  stores: any;
  parentDays: WorkingDay[] = [];

  constructor(stores: any, days: WorkingDay[]) {
    this.stores = stores;
    this.parentDays = days;

    this.hours = new WorkingHours(this.stores, this.title);
  }

  title: string = "";
  hours: WorkingHours;

  fromData(data: any): WorkingDay {
    const { title = "", timeStart = "", timeEnd = "" } = data;
    const dataHours = { timeStart, timeEnd };

    this.title = title;
    this.hours = new WorkingHours(this.stores, title).fromData(dataHours);

    return this;
  }
  toData(): any {
    const dataHours = this.hours.toData();

    return {
      title: this.title,
      timeStart: dataHours.timeStart,
      timeEnd: dataHours.timeEnd,
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }
  compare(item: WorkingDay): number {
    return 0;
  }

  isToday(): boolean {
    return this.hours.isSameDay(new Date());
  }
  isSameDay(date: Date): boolean {
    return this.hours.isSameDay(date);
  }

  getNextWorkingDay(): WorkingDay {
    const found = this.parentDays.find((day) => {
      return this.hours.isAfter(day.hours.getDateEnd());
    });
    if (found) return found;

    const similar = this.parentDays.find((day) => {
      return this.isSameDay(day.hours.getDateEnd());
    });

    if (!similar) return this.parentDays[0];

    const index = this.parentDays.indexOf(similar);
    const nextIndex = index < this.parentDays.length - 1 ? index + 1 : 0;

    return this.parentDays[nextIndex];
  }
}

export default WorkingDay;
