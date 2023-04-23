import { isAfter, isBefore, format, parse, isSameDay } from "date-fns";

class WorkingHours {
   #formatString = "h:mmaaa";
   #dateStart;
   #dateEnd;

   constructor(dateStart = null, dateEnd = null) {
      this.#dateStart = dateStart;
      this.#dateEnd = dateEnd;
   }

   getDateStart() {
      return this.#dateStart;
   }
   getDateEnd() {
      return this.#dateEnd;
   }

   toString() {
      const timeStart = format(this.#dateStart, this.#formatString);
      const timeEnd = format(this.#dateEnd, this.#formatString);
      return `${timeStart} - ${timeEnd}`;
   }
   isSameDay(date) {
      return (
         isSameDay(this.#dateStart, date) && isSameDay(this.#dateStart, date)
      );
   }
   isBetween(date) {
      return this.isStartAfter(date) && this.isEndBefore(date);
   }
   isAfter(date) {
      return this.isStartAfter(date) && this.isEndAfter(date);
   }
   isBefore(date) {
      return this.isStartBefore(date) && this.isEndBefore(date);
   }

   isStartBefore(date) {
      return isBefore(date, this.#dateStart);
   }
   isStartAfter(date) {
      return isAfter(date, this.#dateStart);
   }
   isEndBefore(date) {
      return isBefore(date, this.#dateEnd);
   }
   isEndAfter(date) {
      return isAfter(date, this.#dateEnd);
   }
}
class WorkingDay {
   constructor(title = "", start = "", end = "") {
      const now = new Date();
      const dateHourStart = parse(`${title}${start}`, `ccccHHmm`, now);
      const dateHourEnd = parse(`${title}${end}`, `ccccHHmm`, now);

      this.title = title;
      this.hours = new WorkingHours(dateHourStart, dateHourEnd);
   }

   isToday() {
      return this.hours.isSameDay(new Date());
   }
   isSameDay(date) {
      return this.hours.isSameDay(date);
   }
}
class BusinessDays {
   #days;

   constructor() {
      this.#days = [
         new WorkingDay("Monday", "0900", "1900"),
         new WorkingDay("Tuesday", "0900", "1900"),
         new WorkingDay("Wednesday", "0900", "1900"),
         new WorkingDay("Thursday", "0900", "1900"),
         new WorkingDay("Friday", "0900", "1900"),
         new WorkingDay("Saturday", "0900", "1900"),
         new WorkingDay("Sunday", "1000", "1830"),
      ];
   }

   toArray() {
      return this.#days.map((d) => d);
   }

   getNextWorkingDay(workingDay) {
      const found = this.#days.find((day) => {
         return workingDay.hours.isAfter(day.hours.getDateEnd());
      });
      if (found) return found;

      const similar = this.#days.find((day) => {
         return workingDay.isSameDay(day.hours.getDateEnd());
      });

      if (!similar) return this.#days[0];

      const index = this.#days.indexOf(similar);
      const nextIndex = index < this.#days.length - 1 ? index + 1 : 0;

      return this.#days[nextIndex];
   }
}

export default class Company {
   static name = "Freshnet Enterprise";
   static category = "Computer Store";

   static BusinessDays = new BusinessDays();
}
