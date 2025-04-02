import { optString } from '@chanzor/utils';

import { WorkingHoursModel } from '@/entity/model-v2/WorkingHour.model';

export interface WorkingDayData {
  title?: string;
  timeStart?: string;
  timeEnd?: string;
}

export class WorkingDayModel {
  siblings: WorkingDayModel[] = [];

  title: string = '';
  hours: WorkingHoursModel;

  constructor(data: WorkingDayData, siblings: WorkingDayModel[]) {
    this.siblings = siblings;

    const { title, timeStart, timeEnd } = data;

    this.title = optString(title);
    this.hours = new WorkingHoursModel({ title, timeStart, timeEnd });
  }

  toData(): any {
    const dataHours = this.hours.toData();

    return {
      title: this.title,
      timeStart: dataHours.timeStart,
      timeEnd: dataHours.timeEnd,
    };
  }

  isToday(): boolean {
    return this.hours.isSameDay(new Date());
  }
  isSameDay(date: Date): boolean {
    return this.hours.isSameDay(date);
  }

  getNextWorkingDay(): WorkingDayModel {
    const found = this.siblings.find((day) => {
      return this.hours.isAfter(day.hours.getDateEnd());
    });
    if (found) return found;

    const similar = this.siblings.find((day) => {
      return this.isSameDay(day.hours.getDateEnd());
    });

    if (!similar) return this.siblings[0];

    const index = this.siblings.indexOf(similar);
    const nextIndex = index < this.siblings.length - 1 ? index + 1 : 0;

    return this.siblings[nextIndex];
  }
}
