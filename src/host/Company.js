import Host from "@/host/HostApi";
import { isAfter, isBefore, format, parse, isSameDay } from "date-fns";

class ContactCategory {
   constructor(title = "", icon = "") {
      this.title = title;
      this.icon = icon;
   }
}
class ContactCategories {
   static Call = new ContactCategory("Call", Host.icon("call-color"));
   static Whatsapp = new ContactCategory(
      "Whatsapp",
      Host.icon("whatsapp-color"),
   );
   static Telegram = new ContactCategory(
      "Telegram",
      Host.icon("telegram-color"),
   );
   static Telephone = new ContactCategory(
      "Telephone",
      Host.icon("telephone-color"),
   );
}
class ContactLink {
   constructor(category, id) {
      this.category = category;
      this.id = id;
   }
   toHtmlHref() {
      if (
         this.category === ContactCategories.Call ||
         this.category === ContactCategories.Telephone
      )
         return `tel:+6${this.id}`;
      if (this.category === ContactCategories.Whatsapp)
         return `https://api.whatsapp.com/send?phone=6${this.id}`;
      if (this.category === ContactCategories.Telegram)
         return `https://t.me/${this.id}`;
      return "";
   }
   toHtmlTarget() {
      if (
         this.category === ContactCategories.Call ||
         this.category === ContactCategories.Telephone
      )
         return "_self";
      if (
         this.category === ContactCategories.Whatsapp ||
         this.category === ContactCategories.Telegram
      )
         return "_blank";
      return "";
   }
}
class Contacts {
   static #contacts = [
      {
         title: "Beh Aik Keong",
         links: [
            new ContactLink(ContactCategories.Call, "0167959444"),
            new ContactLink(ContactCategories.Whatsapp, "0167959444"),
         ],
      },
      {
         title: "Office (Mobile)",
         links: [
            new ContactLink(ContactCategories.Call, "0146315353"),
            new ContactLink(ContactCategories.Whatsapp, "0146315353"),
            new ContactLink(ContactCategories.Telegram, "FreshnetEnterprise"),
         ],
      },
      {
         title: "Office",
         links: [new ContactLink(ContactCategories.Telephone, "0332897297")],
      },
      // {
      // 	title: "Office",
      // 	links: [new ContactLink(ContactCategories.Telephone, "0332811526")],
      // },
   ];

   toGroupsByCategory() {
      return Contacts.#contacts.reduce((groups, contact) => {
         const optGroup = (category) => {
            let group = groups.find((group) => group.category === category);
            if (!group) groups.push((group = { category, items: [] }));
            return group;
         };

         for (const link of contact.links) {
            optGroup(link.category).items.push({
               title: contact.title,
               subtitle: link.id,
               href: link.toHtmlHref(),
               target: link.toHtmlTarget(),
            });
         }

         return groups;
      }, []);
   }
   toArray() {
      return Contacts.#contacts;
   }

   findByTitle(title) {
      return Contacts.#contacts.find((contact) => {
         return contact.title === title;
      });
   }
}

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

// this file is in testing phase
export default class Company {
   static name = "Freshnet Enterprise";
   static category = "Computer Store";

   static Contacts = new Contacts();
   static BusinessDays = new BusinessDays();
}
