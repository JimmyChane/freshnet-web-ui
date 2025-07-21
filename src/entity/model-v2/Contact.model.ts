import { type ContactLinkData, ContactLinkModel } from '@/entity/model-v2/ContactLink.model';

export interface ContactData {
  title: string;
  links: ContactLinkData[];
}

export class ContactModel {
  readonly title: string;
  readonly subtitle: string;
  readonly links: ContactLinkModel[];

  constructor(data: ContactData) {
    this.title = data.title;
    this.links = data.links.map((d) => new ContactLinkModel(d));

    this.subtitle = data.links[0].id;
  }

  toData(): ContactData {
    return { title: this.title, links: this.links.map((link) => link.toData()) };
  }
}

export const BEH_AIK_KEONG_CONTACT = new ContactModel({
  title: 'Beh Aik Keong',
  links: [
    { category: 'call', id: '0167959444' },
    { category: 'whatsapp', id: '0167959444' },
  ],
});
export const OFFICE_MOBILE_CONTACT = new ContactModel({
  title: 'Office (Mobile)',
  links: [
    { category: 'call', id: '0146315353' },
    { category: 'whatsapp', id: '0146315353' },
    { category: 'telegram', id: 'FreshnetEnterprise' },
  ],
});
export const OFFICE_CONTACT = new ContactModel({
  title: 'Office',
  links: [{ category: 'telephone', id: '0332897297' }],
});
