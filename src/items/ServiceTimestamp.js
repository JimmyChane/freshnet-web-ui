const Month = {
	Jan: { short: "Jan", full: "January" },
	Feb: { short: "Feb", full: "Febuary" },
	Mar: { short: "Mar", full: "March" },
	Arp: { short: "Arp", full: "April" },
	May: { short: "May", full: "May" },
	Jun: { short: "Jun", full: "June" },
	Jul: { short: "Jul", full: "July" },
	Aug: { short: "Aug", full: "August" },
	Sep: { short: "Sep", full: "September" },
	Oct: { short: "Oct", full: "October" },
	Nov: { short: "Nov", full: "November" },
	Dec: { short: "Dec", full: "December" },
};

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

const getTextOfMonthNumber = (month) => {
	if (month === 0) return "January";
	if (month === 1) return "Febuary";
	if (month === 2) return "March";
	if (month === 3) return "April";
	if (month === 4) return "May";
	if (month === 5) return "June";
	if (month === 6) return "July";
	if (month === 7) return "August";
	if (month === 8) return "September";
	if (month === 9) return "October";
	if (month === 10) return "November";
	if (month === 11) return "December";
	return "";
};
const getTextShortOfMonthNumber = (month) => {
	if (month === 0) return "Jan";
	if (month === 1) return "Feb";
	if (month === 2) return "Mar";
	if (month === 3) return "Apr";
	if (month === 4) return "May";
	if (month === 5) return "Jun";
	if (month === 6) return "Jul";
	if (month === 7) return "Aug";
	if (month === 8) return "Sep";
	if (month === 9) return "Oct";
	if (month === 10) return "Nov";
	if (month === 11) return "Dec";
	return "";
};

import { isToday, isYesterday, isThisYear, getDay, getMonth, getYear } from "date-fns"; // https://date-fns.org/v2.29.3/docs/Getting-Started
import U from "@/U.js";
import ItemSearcher from "./tools/ItemSearcher.js";
const textContains = ItemSearcher.textContains;

class ServiceTimestamp {
	constructor(utc = 0) {
		this.time = utc;
	}

	toCount(strs) {
		return strs.reduce((count, str) => {
			count += textContains("timestamp", str) ? 1 : 0;
			count += textContains(this.toString(), str) ? 1 : 0;
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

	compare(item) {
		let time1 = U.optNumber(this.time);
		let time2 = U.optNumber(item.time);
		return time2 - time1;
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
	getYear() {
		return getYear(this.time);
	}
}

export default ServiceTimestamp;
