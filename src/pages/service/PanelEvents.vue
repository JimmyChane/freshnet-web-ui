<script>
   import ListEvents from "./ListEvents.vue";
   import ItemEvent from "./ItemEvent.vue";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";

   export default {
      components: { ButtonIcon, ListEvents, ItemEvent },
      emits: ["click-add-event", "click-remove-event"],
      props: { service: { type: Object, default: () => null } },
      computed: {
         events() {
            return this.service.events
               .map((event) => event)
               .sort((event1, event2) => event1.compare(event2));
         },
         totalCost: (context) => context.service.toTotalPrice(),
         totalCostText() {
            if (this.totalCost && this.totalCost.amount !== 0) {
               return `Total Cost: ${this.totalCost}`;
            }
            return "";
         },
      },
   };
</script>

<template>
   <div class="PanelEvents">
      <div class="PanelEvents-header">
         <span class="PanelEvents-totalCost" v-if="totalCostText">{{
            totalCostText
         }}</span>
         <span class="PanelEvents-title" v-else>Events</span>
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
      border-radius: 1rem;
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
            font-weight: 600;
            flex-grow: 1;
            font-size: 1.1rem;
            color: hsla(0, 0%, 0%, 0.4);
         }

         .PanelEvents-totalCost {
            text-align: start;
            font-weight: 600;
            flex-grow: 1;
            font-size: 1.1rem;
            color: hsla(0, 0%, 0%, 0.8);
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
