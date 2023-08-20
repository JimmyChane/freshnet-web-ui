<script>
   import ItemOrder from "./ItemOrder.vue";
   export default {
      components: { ItemOrder },
      emits: [
         "click-collapse",
         "click-expand",
         "click-pending",
         "click-complete",
         "click-remove",
      ],
      props: {
         title: { type: String, default: "" },
         items: { type: Array, default: () => [] },
         currentItemIdSelected: { type: String, default: "" },
      },
   };
</script>

<template>
   <div class="SectionOrder transition">
      <span class="SectionOrder-title">{{ `${title} (${items.length})` }}</span>
      <ul class="SectionOrder-list">
         <li class="viewOrder-item" v-for="item in items" :key="item.id">
            <div class="viewOrder-item-seperator"></div>
            <ItemOrder
               :isExpand="currentItemIdSelected === item.id"
               :order="item"
               @onCollapse="$emit('click-collapse', item)"
               @onExpand="$emit('click-expand', item)"
               @onPending="$emit('click-pending', item)"
               @onComplete="$emit('click-complete', item)"
               @onRemove="$emit('click-remove', item)"
            />
         </li>
      </ul>
   </div>
</template>

<style lang="scss" scoped>
   .SectionOrder {
      width: 100%;
      max-width: var(--width-max);
      background: white;
      box-shadow: 0 2px 4px var(--shadow-light);
      padding: 10px;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;

      .SectionOrder-title {
         margin: 0.5rem 0 0.5rem 0;
         padding: 0.625rem;
         font-weight: 600;
         font-size: 1.2rem;
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-start;
         gap: 0.4rem;
      }

      .SectionOrder-list {
         display: flex;
         flex-direction: column;
         list-style: none;

         .SectionOrder-list-item {
            display: flex;
            flex-direction: column;
         }
      }
   }

   .viewOrder-item {
      .viewOrder-item-seperator {
         margin: 4px 0;
         min-width: auto;
         min-height: 0.5px;
         background: hsl(0, 0%, 84%);
         background: hsla(0, 0%, 0%, 0.1);
      }
   }
</style>
