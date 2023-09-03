<script lang="ts">
  import Service from "@/items/Service";
  import ServiceTimestamp from "@/items/ServiceTimestamp";
  import { format, formatDistanceToNow } from "date-fns";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      service: { type: Service },
      line: { type: Number, default: 2 },
    },
    computed: {
      timestamp(): ServiceTimestamp | null {
        return this.service.timestamp ?? null;
      },
      timestampText(): string {
        if (!this.timestamp) return "";

        const time = this.timestamp.time;

        const distance = formatDistanceToNow(time);
        const dateText = format(time, "EEE, dd/LL/yyyy");
        const timeText = format(time, "hh:mmaaa");

        if (this.line === 1) {
          return `${dateText} ${timeText} (${distance} ago)`;
        } else {
          return `${dateText}\n${distance} ago, ${timeText}`;
        }
      },
    },
  });
</script>

<template>
  <p class="ItemService-timestamp">{{ timestampText }}</p>
</template>

<style lang="scss" scoped>
  .ItemService-timestamp {
    max-width: max-content;
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
    font-size: 0.7rem;
  }
</style>
