import {
  isObject,
  isString,
  optArray,
  optBoolean,
  trimId,
  trimText,
} from '@/U';
import { textContains } from '@/objects/ItemSearcher';
import { useUserStore } from '@/pinia-stores/user.store';
import { Item } from '@/stores/tools/List';

import { ServiceBelonging, ServiceBelongingData } from './ServiceBelonging';
import { ServiceCustomer, ServiceCustomerData } from './ServiceCustomer';
import { ServiceEvent } from './ServiceEvent';
import {
  INITIAL_SERVICE_EVENT_METHOD,
  PURCHASE_SERVICE_EVENT_METHOD,
} from './ServiceEventMethod';
import { ServiceImage } from './ServiceImage';
import {
  Label,
  LabelData,
  URGENT_SERVICE_LABEL,
  WARRANTY_SERVICE_LABEL,
} from './ServiceLabel';
import { ServicePrice } from './ServicePrice';
import {
  COMPLETED_SERVICE_STATE,
  PENDING_SERVICE_STATE,
  REJECTED_SERVICE_STATE,
  WAITING_SERVICE_STATE,
  findServiceStateByKey,
  indexServiceStateOfKey,
} from './ServiceState';
import { ServiceTimestamp } from './ServiceTimestamp';
import { User } from './User';

// todo: copied
export interface ServiceData {
  _id?: string;
  time?: number;
  username?: string;
  nameOfUser?: string;
  state?: string;
  imageFiles?: any[];
  events?: any[];
  customer?: ServiceCustomerData;
  description?: string;
  belongings?: ServiceBelongingData[];
  labels?: LabelData[];
  notice?: {
    isUrgent?: boolean;
    isWarranty?: boolean;
  };
}

export class Service implements Item {
  id: string = '';
  timestamp: ServiceTimestamp | null = null;
  username: string = '';
  name: string = '';
  state: string = '';
  customer: ServiceCustomer | null = null;
  description: string = '';
  belongings: ServiceBelonging[] = [];
  private _events: ServiceEvent[] = [];
  imageFiles: ServiceImage[] = [];
  labels: Label[] = [];

  fromData(data: ServiceData): Service {
    this.id = trimId(data._id);
    this.timestamp = data.time ? new ServiceTimestamp(data.time) : null;
    this.username = trimId(data.username);
    this.name = trimText(data.nameOfUser);

    switch (trimId(data.state)) {
      case PENDING_SERVICE_STATE.key:
        this.state = PENDING_SERVICE_STATE.key;
        break;
      case WAITING_SERVICE_STATE.key:
        this.state = WAITING_SERVICE_STATE.key;
        break;
      case COMPLETED_SERVICE_STATE.key:
        this.state = COMPLETED_SERVICE_STATE.key;
        break;
      case REJECTED_SERVICE_STATE.key:
        this.state = REJECTED_SERVICE_STATE.key;
        break;
      default:
        this.state = PENDING_SERVICE_STATE.key;
    }

    this.customer = isObject(data.customer)
      ? new ServiceCustomer().fromData(data.customer)
      : null;
    this.description = trimText(data.description);
    this.belongings = optArray(data.belongings).map((belonging) => {
      return new ServiceBelonging().fromData(belonging);
    });

    this._events = optArray(data.events).map((subData) => {
      return new ServiceEvent().fromData(subData);
    });

    // images
    this.imageFiles = optArray(data.imageFiles).map((image) => {
      return new ServiceImage().fromData(image);
    });

    // labels
    this.labels = optArray(data.labels)
      .map((subData) => new Label().fromData(subData))
      .filter((label) => label.title.trim().length > 0);

    // refactoring notice to labels
    const existingLabelUrgent = this.labels.find((label) => {
      return label.title === URGENT_SERVICE_LABEL.title;
    });
    const existingLabelWarranty = this.labels.find((label) => {
      return label.title === WARRANTY_SERVICE_LABEL.title;
    });
    const notice = {
      isUrgent: !!data.notice?.isUrgent ?? false,
      isWarranty: !!data.notice?.isWarranty ?? false,
    };
    if (notice.isUrgent && !existingLabelUrgent) {
      this.labels.push(URGENT_SERVICE_LABEL);
    }
    if (notice.isWarranty && !existingLabelWarranty) {
      this.labels.push(WARRANTY_SERVICE_LABEL);
    }

    return this;
  }
  toData(): any {
    return {
      _id: trimId(this.id),
      time: this.timestamp?.time ?? null,
      username: trimId(this.username),
      nameOfUser: trimText(this.name),
      state: this.state,
      customer: this.customer?.toData(),
      description: trimText(this.description),
      belongings: this.belongings.map((belonging) => belonging.toData()),
      events: this._events.map((event) => event.toData()),
      imageFiles: this.imageFiles.map((image) => image.toData()),
      labels: this.labels.map((label) => label.toData()),
    };
  }
  toCount(strs: string[]): number {
    const { customer, timestamp, state: stateKey, description } = this;

    const state = findServiceStateByKey(stateKey);
    const stateTitle = state?.title ?? '';

    const ts = [
      'service',
      description,
      stateTitle,
      ...this.labels.map((label) => label.title),
    ];
    let count =
      strs.reduce((count, str) => {
        for (const t of ts) if (textContains(t, str)) count++;
        return count;
      }, 0) +
      this._events.reduce((count, event) => count + event.toCount(strs), 0);
    if (timestamp?.toCount(strs)) count++;
    if (customer?.toCount(strs)) count += 5;

    return count;
  }
  get events(): ServiceEvent[] {
    const serviceData = this.toData();

    const serviceEvent = new ServiceEvent().fromData({
      method: INITIAL_SERVICE_EVENT_METHOD.key,
      time: serviceData.time,
      username: serviceData.username,
      name: serviceData.nameOfUser,
      description: serviceData.description,
      images: serviceData.imageFiles,
    });

    return [serviceEvent, ...this._events].sort((event1, event2) => {
      return event1.compare(event2);
    });
  }
  set events(events: ServiceEvent[]) {
    this._events = events.filter((event) => {
      return event.timestamp?.time !== this.timestamp?.time;
    });
  }

  getUnique(): string {
    return this.id;
  }

  isUrgent(): boolean {
    return !!this.labels.find((label) => label.isEqual(URGENT_SERVICE_LABEL));
  }
  isWarranty(): boolean {
    return !!this.labels.find((label) => {
      return label.isEqual(WARRANTY_SERVICE_LABEL);
    });
  }

  compare(item: Service): number {
    let value = 0;
    if (value === 0) value = this.compareState(item);
    if (value === 0) value = this.compareTimestamp(item);
    return value;
  }
  compareState(item: Service): number {
    return (
      indexServiceStateOfKey(this.state) - indexServiceStateOfKey(item.state)
    );
  }
  compareTimestamp(item: Service): number {
    if (this.timestamp && item.timestamp)
      return this.timestamp.compare(item.timestamp);
    if (this.timestamp || !item.timestamp) return -1;
    if (!this.timestamp || item.timestamp) return 1;

    return 0;
  }
  compareCustomer(item: Service): number {
    if (this.customer && item.customer)
      return this.customer.compare(item.customer);
    if (this.customer || !item.customer) return -1;
    if (!this.customer || item.customer) return 1;

    return 0;
  }
  compareTotalPrice(item: Service): number {
    const totalPrice1 = this.toTotalPrice();
    const totalPrice2 = item.toTotalPrice();
    return totalPrice1.compare(totalPrice2);
  }

  async fetchUser(): Promise<User | undefined> {
    if (!isString(this.username) || this.username.trim().length === 0) {
      return undefined;
    }
    return await useUserStore().getUserByUsername(this.username);
  }
  async fetchName(): Promise<string> {
    const user = await this.fetchUser();
    const username = user?.username ?? '';

    if (username.length && this.name) return `${this.name}(${username})`;
    if (!username.length && this.name) return this.name;
    if (username.length && !this.name) return username;

    throw new Error('unknown');
  }

  toTotalPrice(): ServicePrice {
    return this._events.reduce(
      (cost, event) => {
        if (event.price && event.method === PURCHASE_SERVICE_EVENT_METHOD.key) {
          cost = cost.plus(event.price);
        }
        return cost;
      },
      new ServicePrice().fromData({ amount: 0 }),
    );
  }

  setLabels(labels: Label[] = []) {
    this.labels = optArray(labels)
      .map((label: Label) => new Label().fromData(label.toData()))
      .filter((label) => label.title.trim().length > 0);
  }
  addLabel(label: Label) {
    const labels = this.labels;
    const existingLabel = labels.find((l) => l.isEqual(label));

    if (!existingLabel) {
      this.setLabels([...labels, label]);
    }
  }
  removeLabel(label: Label) {
    const labels = this.labels;
    const existingLabel = labels.find((l) => l.isEqual(label));

    if (existingLabel) {
      this.setLabels(labels.filter((l) => !l.isEqual(label)));
    }
  }

  setUrgent(bool: boolean = false) {
    optBoolean(bool)
      ? this.addLabel(URGENT_SERVICE_LABEL)
      : this.removeLabel(URGENT_SERVICE_LABEL);
  }
  setWarranty(bool: boolean = false) {
    optBoolean(bool)
      ? this.addLabel(WARRANTY_SERVICE_LABEL)
      : this.removeLabel(WARRANTY_SERVICE_LABEL);
  }
}
