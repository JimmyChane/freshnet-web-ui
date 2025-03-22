<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  type WorkingDayData,
  WorkingDayModel,
} from '@/entity/model-v2/WorkingDay.model';

import Section from './PageHome-Section.vue';
import Item from './PageHome-SectionHour-Item.vue';

withDefaults(defineProps<{ isThin?: boolean }>(), { isThin: false });

const items = ref<WorkingDayModel[]>();
const todayWorkingDay = ref<WorkingDayModel>();

onMounted(() => {
  const workingDayDatas: WorkingDayData[] = [
    { title: 'Monday', timeStart: '0900', timeEnd: '1900' },
    { title: 'Tuesday', timeStart: '0900', timeEnd: '1900' },
    { title: 'Wednesday', timeStart: '0900', timeEnd: '1900' },
    { title: 'Thursday', timeStart: '0900', timeEnd: '1900' },
    { title: 'Friday', timeStart: '0900', timeEnd: '1900' },
    { title: 'Saturday', timeStart: '0900', timeEnd: '1900' },
    { title: 'Sunday', timeStart: '1000', timeEnd: '1830' },
  ];

  const workingDays = workingDayDatas.reduce(
    (workingDays: WorkingDayModel[], data) => {
      workingDays.push(new WorkingDayModel(data, workingDays));
      return workingDays;
    },
    [],
  );

  todayWorkingDay.value = workingDays.find((workingDay) => {
    return workingDay.isToday();
  });

  items.value = [];
  const index =
    todayWorkingDay.value === undefined
      ? -1
      : workingDays.indexOf(todayWorkingDay.value);
  const indexBefore = index - 1;
  const indexAfter = index + 1;
  for (let i = indexAfter; i < workingDays.length; i++) {
    const workingDay = workingDays[i];
    items.value.push(workingDay);
  }
  for (let i = 0; i < indexBefore; i++) {
    const workingDay = workingDays[i];
    items.value.push(workingDay);
  }
});
</script>

<template>
  <Section>
    <div class="HomeSectionHour" :isThin="`${isThin}`">
      <div class="HomeSectionHour-header" v-if="todayWorkingDay">
        <div>
          <span>{{ todayWorkingDay.title }}</span>

          <span>Open {{ todayWorkingDay.hours.toStringTimeStart() }}</span>

          <span>Close {{ todayWorkingDay.hours.toStringTimeEnd() }}</span>
        </div>

        <div>
          <p>
            Busy mostly..
            <br />
            10am, 12pm
            <br />
            4pm, 5pm
          </p>
        </div>
      </div>

      <div class="HomeSectionHour-workingDays">
        <Item v-for="item of items" :key="item.title" :item="item" />
      </div>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.HomeSectionHour {
  background: var(--primary-color);
  overflow: hidden;
  color: white;
  gap: 2em;

  border-radius: 1em;
  padding: 1.5em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .HomeSectionHour-header {
    width: 100%;
    gap: 1em;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    & > *:first-child {
      width: 9em;
      max-width: 100%;
      height: 7em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid white;
      // padding: 3em;
      gap: 0.5em;
      border-radius: 1em;
      text-align: center;

      & > *:nth-child(1) {
        font-weight: 600;
        font-size: 1.2em;
      }
    }
    & > *:last-child {
      text-align: end;
    }
  }
  .HomeSectionHour-workingDays {
    width: 100%;
    gap: 0.5em;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5em;
  }
}
.HomeSectionHour[isThin='true'] {
  width: 100%;
  height: 100%;
  font-size: 1rem;
}
.HomeSectionHour[isThin='false'] {
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
}
</style>
