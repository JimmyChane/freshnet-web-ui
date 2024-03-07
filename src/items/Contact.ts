 
import Host from "@/host/Server";

// icon
import IconCall from "@/assets/icon/call-color.svg";
import IconWhatsapp from "@/assets/icon/whatsapp-color.svg";
import IconTelegram from "@/assets/icon/telegram-color.svg";
import IconTelephone from "@/assets/icon/telephone-color.svg";
import { optString } from "@/U";

interface ContactLinkData {
  id: string;
  category?: string;
}

interface ContactData {
  title: string;
  links: ContactLinkData[];
}

class ContactCategory {
  static Call: ContactCategory = new ContactCategory("call", "Call", IconCall);
  static Whatsapp: ContactCategory = new ContactCategory(
    "whatsapp",
    "Whatsapp",
    IconWhatsapp,
  );
  static Telegram: ContactCategory = new ContactCategory(
    "telegram",
    "Telegram",
    IconTelegram,
  );
  static Telephone: ContactCategory = new ContactCategory(
    "telephone",
    "Telephone",
    IconTelephone,
  );

  key: string = "";
  title: string = "";
  icon: string = "";

  constructor(key: string = "", title: string = "", icon: string = "") {
    this.key = key;
    this.title = title;
    this.icon = icon;
  }
}

class ContactLink {
  stores: any = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  category: ContactCategory | null = null;
  id: string = "";

  fromData(data: ContactLinkData): this {
    this.id =   optString(data.id);
    this.category =
      [
        ContactCategory.Call,
        ContactCategory.Whatsapp,
        ContactCategory.Telegram,
        ContactCategory.Telephone,
      ].find((category) => category.key === data.category) ?? null;

    return this;
  }

  toData(): ContactLinkData {
    const data: ContactLinkData = { id: this.id };

    if (this.category instanceof ContactCategory) {
      data.category = this.category.key;
    }

    return data;
  }

  toCount(strs: string[]): number {
    return 0;
  }

  compare(item: ContactLink): number {
    return 0;
  }

  toHtmlHref(): string {
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

  toHtmlTarget(): string {
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
  stores: any = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  title: string = "";
  links: ContactLink[] = [];

  fromData(data: ContactData): this {
    this.title = data.title;
    this.links = data.links.map((link) => {
      return new ContactLink(this.stores).fromData(link);
    });

    return this;
  }

  toData(): ContactData {
    return {
      title: this.title,
      links: this.links.map((link) => link.toData()),
    };
  }

  toCount(strs: string[]): number {
    return 0;
  }

  compare(item: Contact): number {
    return 0;
  }
}

export default Contact;
