import { optString } from '@chanzor/utils';
import { format, isAfter, isBefore, isSameDay, parse } from 'date-fns';

export interface WorkingHoursData {
  title?: string;
  timeStart?: string;
  timeEnd?: string;
}

export class WorkingHoursModel {
  readonly parentDay: string;

  private formatString: string = 'h:mmaaa';

  private timeStart: string;
  private timeEnd: string;

  private dateStart: Date;
  private dateEnd: Date;

  constructor(data: WorkingHoursData) {
    this.parentDay = optString(data.title);

    const { timeStart, timeEnd } = data;

    const now = new Date();
    const dateHourStart = parse(
      `${this.parentDay}${timeStart}`,
      `ccccHHmm`,
      now,
    );
    const dateHourEnd = parse(`${this.parentDay}${timeEnd}`, `ccccHHmm`, now);

    this.timeStart = optString(timeStart);
    this.timeEnd = optString(timeEnd);
    this.dateStart = dateHourStart;
    this.dateEnd = dateHourEnd;
  }

  toData(): any {
    return { timeStart: this.timeStart, timeEnd: this.timeEnd };
  }

  getDateStart(): Date {
    return this.dateStart;
  }
  getDateEnd(): Date {
    return this.dateEnd;
  }

  toStringTimeStart(): string {
    return format(this.dateStart, this.formatString);
  }
  toStringTimeEnd(): string {
    return format(this.dateEnd, this.formatString);
  }

  toString(): string {
    const timeStart = this.toStringTimeStart();
    const timeEnd = this.toStringTimeEnd();
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
