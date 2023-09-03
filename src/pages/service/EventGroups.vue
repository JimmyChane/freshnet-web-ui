<script lang="ts">
  import ItemEvent from "./ServiceEvent.vue";
  import FloatingTimestampVue from "./FloatingTimestamp.vue";
  import Service from "@/items/Service";
  import { format } from "date-fns";
  import Vue from "vue";
  import ServiceEvent from "@/items/ServiceEvent";

  interface Group {
    title: string;
    events: ServiceEvent[];
  }

  export default Vue.extend({
    components: { ItemEvent, FloatingTimestampVue },
    props: {
      service: { type: Service },
      events: { type: Array, default: () => [] },
      actions: { type: Object },
    },
    computed: {
      moreEvents(): ServiceEvent[] {
        if (!this.service) return [];

        return [...this.service.events].reverse();
      },

      groups(): Group[] {
        return this.moreEvents.reduce((groups: Group[], event) => {
          const ts = event.timestamp;
          const time = ts?.time ?? 0;

          const optGroup = (title: string) => {
            let group = groups.find((group) => group.title === title);
            if (!group) {
              group = { title, events: [] };
              groups.push(group);
            }
            return group;
          };
          const putItem = (title: string) => {
            optGroup(title).events.push(event);
          };

          if (ts?.isToday()) {
            putItem(`Today, ${format(time, "EEE, dd/LL/yyyy")}`);
          } else if (ts?.isYesterday()) {
            putItem(`Yesterday, ${format(time, "EEE, dd/LL/yyyy")}`);
          } else {
            putItem(format(time, "EEE, dd/LL/yyyy"));
          }

          return groups;
        }, []);
      },
    },
  });
</script>

<template>
  <div class="ListEvents">
    <div class="ListEvents-group" v-for="group of groups" :key="group.title">
      <FloatingTimestampVue
        :style="{ top: '4rem', 'z-index': '3' }"
        v-if="group.title"
        :title="group.title"
      />

      <ItemEvent
        class="ListEvents-group-item"
        v-for="event of group.events"
        :key="event.timestamp.time"
        :service="service"
        :event="event"
        :actions="actions"
        @callback-delete="(event) => $emit('click-item-delete', event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ListEvents {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;

    .ListEvents-group {
      width: 100%;
      gap: 0.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ListEvents-group-item {
        z-index: 2;
        width: 100%;
      }
    }
  }
</style>
