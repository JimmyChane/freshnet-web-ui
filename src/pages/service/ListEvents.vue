<script>
   import ItemEvent from "./ItemEvent.vue";
   import { format } from "date-fns";

   export default {
      components: { ItemEvent },
      props: {
         service: { type: Object },
         events: { type: Array, default: () => [] },
      },
      computed: {
         groups() {
            return this.events.reduce((groups, event) => {
               const ts = event.timestamp;
               const time = ts.time;

               const optGroup = (title) => {
                  let group = groups.find((group) => group.title === title);
                  if (!group) groups.push((group = { title, events: [] }));
                  return group;
               };
               const putItem = (title) => optGroup(title).events.push(event);

               if (ts.isToday()) {
                  putItem(`Today, ${format(time, "EEE, dd/LL/yyyy")}`);
               } else if (ts.isYesterday()) {
                  putItem(`Yesterday, ${format(time, "EEE, dd/LL/yyyy")}`);
               } else {
                  putItem(format(time, "EEE, dd/LL/yyyy"));
               }

               return groups;
            }, []);
         },
      },
   };
</script>

<template>
   <div class="ListEvents">
      <div class="ListEvents-group" v-for="group of groups" :key="group.title">
         <span class="ListEvents-group-title" v-if="group.title">{{
            group.title
         }}</span>

         <ItemEvent
            class="ListEvents-group-item"
            v-for="event of group.events"
            :key="event.timestamp.time"
            :service="service"
            :event="event"
            @callback-delete="(event) => $emit('click-item-delete', event)"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ListEvents {
      display: flex;
      flex-direction: column;

      .ListEvents-group {
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;

         .ListEvents-group-title {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            font-size: 0.8rem;
            font-weight: 600;
            background: hsl(0, 0%, 98%);
            border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
            padding: 0.2rem 0.4rem;
            text-align: center;

            position: sticky;
            top: 0;
            z-index: 3;
         }
         .ListEvents-group-item {
            z-index: 2;
            width: 100%;
         }
      }
   }
</style>
