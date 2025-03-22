import { optString } from '@/U';
import {
  CALL,
  SocialMediaModel,
  TELEGRAM,
  TELEPHONE,
  WHATSAPP,
} from '@/entity/model-v2/SocialMedia.model';

export interface ContactLinkData {
  id: string;
  category?: string;
}

export class ContactLinkModel {
  readonly socialMedia?: SocialMediaModel;
  readonly id: string;

  constructor(data: ContactLinkData) {
    this.id = optString(data.id);
    this.socialMedia = [CALL, WHATSAPP, TELEGRAM, TELEPHONE].find(
      (category) => {
        return category.key === data.category;
      },
    );
  }

  toData(): ContactLinkData {
    const data: ContactLinkData = { id: this.id };

    if (this.socialMedia instanceof SocialMediaModel) {
      data.category = this.socialMedia.key;
    }

    return data;
  }

  toHtmlHref(): string {
    if (this.socialMedia === CALL || this.socialMedia === TELEPHONE)
      return `tel:+6${this.id}`;
    if (this.socialMedia === WHATSAPP)
      return `https://api.whatsapp.com/send?phone=6${this.id}`;
    if (this.socialMedia === TELEGRAM) return `https://t.me/${this.id}`;
    return '';
  }

  toHtmlTarget(): string {
    if (this.socialMedia === CALL || this.socialMedia === TELEPHONE)
      return '_self';
    if (this.socialMedia === WHATSAPP || this.socialMedia === TELEGRAM)
      return '_blank';
    return '';
  }
}
