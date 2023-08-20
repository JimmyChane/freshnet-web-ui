<script>
   import { format, formatDistanceToNow } from "date-fns";

   export default {
      props: {
         service: { type: Object },
         line: { type: Number, default: 2 },
      },
      computed: {
         timestamp: (c) => c.service.timestamp ?? null,
         timestampText: (c) => {
            if (!c.timestamp) return "";

            const time = c.timestamp.time;

            const distance = formatDistanceToNow(time);
            const dateText = format(time, "EEE, dd/LL/yyyy");
            const timeText = format(time, "hh:mmaaa");

            if (c.line === 1) {
               return `${dateText} ${timeText} (${distance} ago)`;
            } else {
               return `${dateText}\n${distance} ago, ${timeText}`;
            }
         },
      },
   };
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
