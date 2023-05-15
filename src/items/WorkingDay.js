import { isAfter, isBefore, format, parse, isSameDay } from "date-fns";

class WorkingHours {
   stores = null;
   parentDay = "";
   constructor(stores, day = "") {
      this.stores = stores;
      this.parentDay = day;
   }

   #formatString = "h:mmaaa";

   #timeStart = "";
   #timeEnd = "";

   #dateStart;
   #dateEnd;

   fromData(data) {
      const { timeStart, timeEnd } = data;

      const now = new Date();
      const dateHourStart = parse(
         `${this.parentDay}${timeStart}`,
         `ccccHHmm`,
         now,
      );
      const dateHourEnd = parse(`${this.parentDay}${timeEnd}`, `ccccHHmm`, now);

      this.#timeStart = timeStart;
      this.#timeEnd = timeEnd;
      this.#dateStart = dateHourStart;
      this.#dateEnd = dateHourEnd;

      return this;
   }
   toData() {
      return { timeStart: this.#timeStart, timeEnd: this.#timeEnd };
   }
   toCount(strs) {
      return 0;
   }
   compare(item) {
      return 0;
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
   stores = null;
   parentDays = [];
   constructor(stores, days) {
      this.stores = stores;
      this.parentDays = days;
   }

   title = "";
   hours = "";
   fromData(data) {
      const { title = "", timeStart = "", timeEnd = "" } = data;
      const dataHours = { timeStart, timeEnd };

      this.title = title;
      this.hours = new WorkingHours(this.stores, title).fromData(dataHours);

      return this;
   }
   toData() {
      const dataHours = this.hours.toData();

      return {
         title: this.title,
         timeStart: dataHours.timeStart,
         timeEnd: dataHours.timeEnd,
      };
   }
   toCount(strs) {
      return 0;
   }
   compare(item) {
      return 0;
   }

   isToday() {
      return this.hours.isSameDay(new Date());
   }
   isSameDay(date) {
      return this.hours.isSameDay(date);
   }

   getNextWorkingDay() {
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
