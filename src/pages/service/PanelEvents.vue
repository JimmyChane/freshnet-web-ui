<script>
   import ListEvents from "./ListEvents.vue";
   import ItemEvent from "./ItemEvent.vue";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";

   export default {
      components: { ButtonIcon, ListEvents, ItemEvent },
      emits: ["click-add-event", "click-remove-event"],
      props: { service: { type: Object, default: () => null } },
      computed: {
         events: (c) => {
            return c.service.events
               .map((event) => event)
               .sort((event1, event2) => event1.compare(event2));
         },
         totalCost: (c) => c.service.toTotalPrice(),
         totalCostText: (c) => {
            return `Total Cost: ${c.totalCost}`;
            if (c.totalCost && c.totalCost.amount !== 0) {
               return `Total Cost: ${c.totalCost}`;
            }
            return "";
         },
      },
   };
</script>

<template>
   <div class="PanelEvents">
      <div class="PanelEvents-header">
         <span class="PanelEvents-title">Events</span>
         <span class="PanelEvents-totalCost">{{ totalCostText }}</span>
      </div>

      <div :class="['PanelEvents-body', 'PanelEvents-body-empty']">
         <ListEvents
            v-if="events.length"
            :items="events"
            @click-item-delete="(event) => $emit('click-remove-event', event)"
         />
         <span class="PanelEvents-empty" v-if="!events.length">
            Empty Events
         </span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelEvents {
      width: 100%;
      max-width: 40rem;
      margin: 1.2rem;
      z-index: 1;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;

      border: 1px solid rgba(0, 0, 0, 0.05);
      overflow: hidden;

      .PanelEvents-header {
         width: 100%;
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: space-between;
         min-height: 1.8rem;
         padding: 0.8rem;
         background-color: hsla(0, 0%, 100%, 0.8);
         border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);

         .PanelEvents-title {
            text-align: start;
            flex-grow: 1;
         }

         .PanelEvents-totalCost {
            min-width: max-content;
            text-align: end;
            font-weight: 600;
         }
      }

      .PanelEvents-body {
         z-index: 1;
         max-height: 20rem;
         overflow-y: auto;
         position: relative;
         padding-bottom: 0;

         .PanelEvents-empty {
            padding: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: hsla(0, 0%, 100%, 0.4);

            font-size: 0.8rem;
            color: hsla(0, 0%, 0%, 0.5);
         }
      }
   }
</style>
