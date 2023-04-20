const getTextOfDayNumber = (day) => {
   if (day === 0) return "Sunday";
   if (day === 1) return "Monday";
   if (day === 2) return "Tuesday";
   if (day === 3) return "Wednesday";
   if (day === 4) return "Thursday";
   if (day === 5) return "Friday";
   if (day === 6) return "Saturday";
   return "";
};

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

import U from "@/U.js";
import ItemSearcher from "../objects/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ServiceTimestamp {
   constructor(utc = 0) {
      this.time = utc;
   }

   toCount(strs) {
      return strs.reduce((count, str) => {
         if (textContains("timestamp", str)) count++;
         if (textContains(this.toString(), str)) count++;
         return count;
      }, 0);
   }
   toString() {
      if (this.isToday()) return this.toStringHoursMinutes();

      return `${this.toStringDay()} ${this.toStringDate()} ${this.toStringHoursMinutes()}`;
   }
   toStringDay() {
      const timestamp = new Date(this.time);
      const day = timestamp.getDay();
      return getTextOfDayNumber(day);
   }
   toStringDate() {
      const timestamp = new Date(this.time);

      const date = timestamp.getDate();
      const month = timestamp.getMonth() + 1;
      const year = timestamp.getFullYear();

      return `${date.toString().length === 1 ? `0${date}` : date}/${
         month.toString().length === 1 ? `0${month}` : month
      }/${year}`;
   }
   toStringHoursMinutes() {
      const timestamp = new Date(this.time);

      const hour = timestamp.getHours();
      const minute = timestamp.getMinutes();
      const afterTime = hour < 12 ? "am" : "pm";

      return `${hour.toString().length === 1 ? `0${hour}` : hour}:${
         minute.toString().length === 1 ? `0${minute}` : minute
      }${afterTime}`;
   }

   isToday() {
      return isToday(this.time);
   }
   isYesterday() {
      return isYesterday(this.time);
   }

   isDayBy(num) {
      return getDay(this.time) === num;
   }
   isSunday() {
      return this.isDayBy(0);
   }
   isMonday() {
      return this.isDayBy(1);
   }
   isTuesday() {
      return this.isDayBy(2);
   }
   isWednesday() {
      return this.isDayBy(3);
   }
   isThursday() {
      return this.isDayBy(4);
   }
   isFriday() {
      return this.isDayBy(5);
   }
   isSaturday() {
      return this.isDayBy(6);
   }

   isMonthBy(num) {
      return getMonth(this.time) === num;
   }
   isJanuary() {
      return this.isMonthBy(0);
   }
   isFebuary() {
      return this.isMonthBy(1);
   }
   isMarch() {
      return this.isMonthBy(2);
   }
   isApril() {
      return this.isMonthBy(3);
   }
   isMay() {
      return this.isMonthBy(4);
   }
   isJune() {
      return this.isMonthBy(5);
   }
   isJuly() {
      return this.isMonthBy(6);
   }
   isAugust() {
      return this.isMonthBy(7);
   }
   isSeptember() {
      return this.isMonthBy(8);
   }
   isOctober() {
      return this.isMonthBy(9);
   }
   isNovember() {
      return this.isMonthBy(10);
   }
   isDecember() {
      return this.isMonthBy(11);
   }

   isThisYear() {
      return isThisYear(this.time);
   }
   isWithinWeek() {
      const today = new Date();
      const dayWeek = getDay(today);
      const dayWeekPrevious = previousDay(today, dayWeek);
      const timeStartWeek = endOfDay(dayWeekPrevious);
      return this.time > timeStartWeek;
   }

   compare(item) {
      let time1 = U.optNumber(this.time);
      let time2 = U.optNumber(item.time);
      return time2 - time1;
   }

   getYear() {
      return getYear(this.time);
   }
}

export default ServiceTimestamp;
