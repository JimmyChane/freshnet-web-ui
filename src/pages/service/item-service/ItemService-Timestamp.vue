<script>
   import { format, formatDistanceToNow } from "date-fns";

   export default {
      props: {
         service: { type: Object },
      },
      computed: {
         timestamp: (c) => c.service.timestamp ?? null,
         timestampText: (c) => {
            if (!c.timestamp) return "";

            const time = c.timestamp.time;

            const distance = formatDistanceToNow(time);
            const distanceText = `(${distance} ago)`;

            const timeText = format(time, "EEE, dd/LL/yyyy hh:mmaaa");

            return `${timeText} ${distanceText}`;
         },
      },
   };
</script>

<template>
   <span class="ItemService-timestamp">{{ timestampText }}</span>
</template>

<style lang="scss" scoped>
   .ItemService-timestamp {
      max-width: max-content;
      color: rgb(112, 112, 112);
      flex-grow: 1;
      text-align: center;
   }
</style>
