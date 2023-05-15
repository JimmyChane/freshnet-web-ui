import U from "@/U";
import Host from "@/host/HostApi";

class ContactCategory {
   static Call = new ContactCategory("call", "Call", Host.icon("call-color"));
   static Whatsapp = new ContactCategory(
      "whatsapp",
      "Whatsapp",
      Host.icon("whatsapp-color"),
   );
   static Telegram = new ContactCategory(
      "telegram",
      "Telegram",
      Host.icon("telegram-color"),
   );
   static Telephone = new ContactCategory(
      "telephone",
      "Telephone",
      Host.icon("telephone-color"),
   );

   constructor(key = "", title = "", icon = "") {
      this.key = key;
      this.title = title;
      this.icon = icon;
   }
}
class ContactLink {
   stores = null;
   constructor(stores) {
      this.stores = stores;
   }

   category = null;
   id = "";
   fromData(data) {
      this.id = U.optString(data.id);
      this.category =
         [
            ContactCategory.Call,
            ContactCategory.Whatsapp,
            ContactCategory.Telegram,
            ContactCategory.Telephone,
         ].find((category) => category.key === data.category) ?? null;

      return this;
   }
   toData() {
      const data = { id: this.id };

      if (this.category instanceof ContactCategory) {
         data.category = this.category.key;
      }

      return data;
   }
   toCount(strs) {
      return 0;
   }
   compare(item) {
      return 0;
   }

   toHtmlHref() {
      if (
         this.category === ContactCategory.Call ||
         this.category === ContactCategory.Telephone
      )
         return `tel:+6${this.id}`;
      if (this.category === ContactCategory.Whatsapp)
         return `https://api.whatsapp.com/send?phone=6${this.id}`;
      if (this.category === ContactCategory.Telegram)
         return `https://t.me/${this.id}`;
      return "";
   }
   toHtmlTarget() {
      if (
         this.category === ContactCategory.Call ||
         this.category === ContactCategory.Telephone
      )
         return "_self";
      if (
         this.category === ContactCategory.Whatsapp ||
         this.category === ContactCategory.Telegram
      )
         return "_blank";
      return "";
   }
}
class Contact {
   stores = null;
   constructor(stores) {
      this.stores = stores;
   }

   title = "";
   links = [];
   fromData(data) {
      this.title = data.title;
      this.links = data.links.map((link) => {
         return new ContactLink(this.stores).fromData(link);
      });

      return this;
   }
   toData() {
      return {
         title: this.title,
         links: this.links.map((link) => link.toData()),
      };
   }
   toCount(strs) {
      return 0;
   }
   compare(item) {
      return 0;
   }
}

export default Contact;
