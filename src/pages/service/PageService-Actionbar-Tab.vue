<script>
   export default {
      props: {
         item: { type: Object },
         isWide: { type: Boolean, default: false },
      },
      computed: {
         primaryColor: (c) => c.item.primaryColor,
         title: (c) => c.item.title,
         icon: (c) => c.item.icon,
         iconSelected: (c) => c.item.iconSelected,
         count: (c) => c.item.list.length,
      },
   };
</script>

<template>
   <button
      :class="['Tab', 'transition']"
      :style="{ '--primary-color': primaryColor }"
      :isWide="`${item.isSelected() || isWide}`"
      :isSelected="`${item.isSelected()}`"
      @click="item.click()"
   >
      <img class="Tab-icon" :src="item.isSelected() ? iconSelected : icon" />
      <span :class="['Tab-title', 'transition']">{{ title }}</span>
      <span class="Tab-count">({{ count }})</span>
   </button>
</template>

<style lang="scss" scoped>
   .Tab {
      --primary-color: inherit;

      height: 2.4rem;
      border: none;
      border-radius: 0.8rem;
      font-size: 1rem;
      padding: 0.5rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      transition-timing-function: cubic-bezier(1, 0, 0, 1);

      .Tab-icon {
         z-index: 2;
         width: 1.5rem;
         height: 1.5rem;
         padding: 0.25rem;
      }
      .Tab-title {
         z-index: 1;
         text-align: start;
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         font-weight: 600;
         transition-timing-function: cubic-bezier(1, 0, 0, 1);
      }
      .Tab-count {
         min-width: max-content;
         font-size: 0.8em;
      }
   }

   .Tab[isWide="true"] {
      width: 10rem;
      width: 9rem;
      gap: 0.2rem;
   }
   .Tab[isWide="false"] {
      width: 4rem;
      gap: 0;
      .Tab-title {
         width: 0;
         height: 0;
         opacity: 0;
      }
   }

   .Tab[isSelected="true"] {
      background: var(--primary-color);
      color: white;
   }
   .Tab[isSelected="false"] {
      background: none;
      cursor: pointer;
      color: var(--primary-color);

      &:hover {
         background-color: #e2e2e2;
      }
   }
</style>
