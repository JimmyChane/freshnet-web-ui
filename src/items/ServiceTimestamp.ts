import {
  isToday,
  isYesterday,
  isThisYear,
  getDay,
  getMonth,
  getYear,
  previousDay,
  endOfDay,
} from "date-fns";
import U from "@/U";
import ItemSearcher from "../objects/ItemSearcher";
const textContains = ItemSearcher.textContains;

const getTextOfDayNumber = (day: number): string => {
  if (day === 0) return "Sunday";
  if (day === 1) return "Monday";
  if (day === 2) return "Tuesday";
  if (day === 3) return "Wednesday";
  if (day === 4) return "Thursday";
  if (day === 5) return "Friday";
  if (day === 6) return "Saturday";
  return "";
};

export default class ServiceTimestamp {
  time: number;

  constructor(utc: number = 0) {
    this.time = utc;
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains("timestamp", str)) count++;
      if (textContains(this.toString(), str)) count++;
      return count;
    }, 0);
  }

  toString(): string {
    if (this.isToday()) return this.toStringHoursMinutes();
    return `${this.toStringDay()} ${this.toStringDate()} ${this.toStringHoursMinutes()}`;
  }

  toStringDay(): string {
    const timestamp = new Date(this.time);
    const day = timestamp.getDay();
    return getTextOfDayNumber(day);
  }

  toStringDate(): string {
    const timestamp = new Date(this.time);

    const date = timestamp.getDate();
    const month = timestamp.getMonth() + 1;
    const year = timestamp.getFullYear();

    return `${date.toString().length === 1 ? `0${date}` : date}/${
      month.toString().length === 1 ? `0${month}` : month
    }/${year}`;
  }

  toStringHoursMinutes(): string {
    const timestamp = new Date(this.time);

    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();
    const afterTime = hour < 12 ? "am" : "pm";

    return `${hour.toString().length === 1 ? `0${hour}` : hour}:${
      minute.toString().length === 1 ? `0${minute}` : minute
    }${afterTime}`;
  }

  isToday(): boolean {
    return isToday(this.time);
  }

  isYesterday(): boolean {
    return isYesterday(this.time);
  }

  isDayBy(num: number): boolean {
    return getDay(this.time) === num;
  }

  isSunday(): boolean {
    return this.isDayBy(0);
  }

  isMonday(): boolean {
    return this.isDayBy(1);
  }

  isTuesday(): boolean {
    return this.isDayBy(2);
  }

  isWednesday(): boolean {
    return this.isDayBy(3);
  }

  isThursday(): boolean {
    return this.isDayBy(4);
  }

  isFriday(): boolean {
    return this.isDayBy(5);
  }

  isSaturday(): boolean {
    return this.isDayBy(6);
  }

  isMonthBy(num: number): boolean {
    return getMonth(this.time) === num;
  }

  isJanuary(): boolean {
    return this.isMonthBy(0);
  }

  isFebuary(): boolean {
    return this.isMonthBy(1);
  }

  isMarch(): boolean {
    return this.isMonthBy(2);
  }

  isApril(): boolean {
    return this.isMonthBy(3);
  }

  isMay(): boolean {
    return this.isMonthBy(4);
  }

  isJune(): boolean {
    return this.isMonthBy(5);
  }

  isJuly(): boolean {
    return this.isMonthBy(6);
  }

  isAugust(): boolean {
    return this.isMonthBy(7);
  }

  isSeptember(): boolean {
    return this.isMonthBy(8);
  }

  isOctober(): boolean {
    return this.isMonthBy(9);
  }

  isNovember(): boolean {
    return this.isMonthBy(10);
  }

  isDecember(): boolean {
    return this.isMonthBy(11);
  }

  isThisYear(): boolean {
    return isThisYear(this.time);
  }

  isWithinWeek(): boolean {
    const today = new Date();
    const dayWeek = getDay(today);
    const dayWeekPrevious = previousDay(today, dayWeek);
    const timeStartWeek = endOfDay(dayWeekPrevious);
    return this.time > timeStartWeek.getTime();
  }

  compare(item: ServiceTimestamp): number {
    let time1 = U.optNumber(this.time);
    let time2 = U.optNumber(item.time);
    return time2 - time1;
  }

  getYear(): number {
    return getYear(this.time);
  }
}
