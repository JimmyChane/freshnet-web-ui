import { optString } from '@chanzor/utils';

import IconCall from '@/assets/icon/call-color.svg';
import IconTelegram from '@/assets/icon/telegram-color.svg';
import IconTelephone from '@/assets/icon/telephone-color.svg';
import IconWhatsapp from '@/assets/icon/whatsapp-color.svg';

interface ContactLinkData {
  id: string;
  category?: string;
}

interface ContactData {
  title: string;
  links: ContactLinkData[];
}

class ContactCategory {
  key: string = '';
  title: string = '';
  icon: string = '';

  constructor(key: string = '', title: string = '', icon: string = '') {
    this.key = key;
    this.title = title;
    this.icon = icon;
  }
}

export const CallContactCategory = new ContactCategory(
  'call',
  'Call',
  IconCall,
);
export const WhatsappContactCategory = new ContactCategory(
  'whatsapp',
  'Whatsapp',
  IconWhatsapp,
);
export const TelegramContactCategory = new ContactCategory(
  'telegram',
  'Telegram',
  IconTelegram,
);
export const TelephoneContactCategory = new ContactCategory(
  'telephone',
  'Telephone',
  IconTelephone,
);

class ContactLink {
  stores: any = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  category: ContactCategory | null = null;
  id: string = '';

  fromData(data: ContactLinkData): this {
    this.id = optString(data.id);
    this.category =
      [
        CallContactCategory,
        WhatsappContactCategory,
        TelegramContactCategory,
        TelephoneContactCategory,
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
      this.category === CallContactCategory ||
      this.category === TelephoneContactCategory
    )
      return `tel:+6${this.id}`;
    if (this.category === WhatsappContactCategory)
      return `https://api.whatsapp.com/send?phone=6${this.id}`;
    if (this.category === TelegramContactCategory)
      return `https://t.me/${this.id}`;
    return '';
  }

  toHtmlTarget(): string {
    if (
      this.category === CallContactCategory ||
      this.category === TelephoneContactCategory
    )
      return '_self';
    if (
      this.category === WhatsappContactCategory ||
      this.category === TelegramContactCategory
    )
      return '_blank';
    return '';
  }
}

export class Contact {
  stores: any = null;

  constructor(stores: any) {
    this.stores = stores;
  }

  title: string = '';
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
