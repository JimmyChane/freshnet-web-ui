import IconCall from '@/assets/icon/call-color.svg';
import IconTelegram from '@/assets/icon/telegram-color.svg';
import IconTelephone from '@/assets/icon/telephone-color.svg';
import IconWhatsapp from '@/assets/icon/whatsapp-color.svg';

export class SocialMediaModel {
  readonly key: string;
  readonly title: string;
  readonly icon: string;

  constructor(key: string, extra: { title: string; icon: string }) {
    this.key = key;
    this.title = extra.title;
    this.icon = extra.icon;
  }
}

export const CALL = new SocialMediaModel('call', {
  title: 'Call',
  icon: IconCall,
});
export const WHATSAPP = new SocialMediaModel('whatsapp', {
  title: 'Whatsapp',
  icon: IconWhatsapp,
});
export const TELEGRAM = new SocialMediaModel('telegram', {
  title: 'Telegram',
  icon: IconTelegram,
});
export const TELEPHONE = new SocialMediaModel('telephone', {
  title: 'Telephone',
  icon: IconTelephone,
});
