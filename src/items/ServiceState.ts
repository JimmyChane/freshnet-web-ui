import IconCompletedColor from '@/assets/icon/completed-color.svg';
import IconCompletedWhite from '@/assets/icon/completed-white.svg';
import IconPendingColor from '@/assets/icon/pending-color.svg';
import IconPendingWhite from '@/assets/icon/pending-white.svg';
import IconRejectedColor from '@/assets/icon/rejected-color.svg';
import IconRejectedWhite from '@/assets/icon/rejected-white.svg';
import IconWaitingColor from '@/assets/icon/waiting-color.svg';
import IconWaitingWhite from '@/assets/icon/waiting-white.svg';

export default class ServiceState {
  key: string;
  title: string;
  icon: { white: string; color: string };
  primaryColor: string;

  constructor(
    key: string = '',
    title: string = '',
    icon: { white: string; color: string } = { white: '', color: '' },
    primaryColor: string = '',
  ) {
    this.key = key;
    this.title = title;
    this.icon = icon;
    this.primaryColor = primaryColor;
  }
}

export const PENDING_SERVICE_STATE = new ServiceState(
  'pending',
  'Working',
  { white: IconPendingWhite, color: IconPendingColor },
  '#f4a60d',
);
export const WAITING_SERVICE_STATE = new ServiceState(
  'waiting',
  'Waiting for Pickup',
  { white: IconWaitingWhite, color: IconWaitingColor },
  '#c336d9',
);
export const COMPLETED_SERVICE_STATE = new ServiceState(
  'completed',
  'Finished & Pickup',
  { white: IconCompletedWhite, color: IconCompletedColor },
  '#25ad86',
);
export const REJECTED_SERVICE_STATE = new ServiceState(
  'rejected',
  'Rejected & Pickup',
  { white: IconRejectedWhite, color: IconRejectedColor },
  '#d94136',
);

const LIST: Readonly<ServiceState[]> = [
  PENDING_SERVICE_STATE,
  WAITING_SERVICE_STATE,
  COMPLETED_SERVICE_STATE,
  REJECTED_SERVICE_STATE,
];

export function findServiceStateByKey(key: string): ServiceState | undefined {
  return LIST.find((state) => state.key === key);
}
export function indexServiceStateOfKey(key: string): number {
  const state = findServiceStateByKey(key);
  if (state === undefined) return -1;
  return LIST.indexOf(state);
}
export function mapServiceState(call: (state: ServiceState) => any): any[] {
  return LIST.map(call);
}
export function countServiceState(): number {
  return LIST.length;
}
