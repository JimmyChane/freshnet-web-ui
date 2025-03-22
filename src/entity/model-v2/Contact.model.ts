import {
  type ContactLinkData,
  ContactLinkModel,
} from '@/entity/model-v2/ContactLink.model';

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
    return {
      title: this.title,
      links: this.links.map((link) => link.toData()),
    };
  }
}
