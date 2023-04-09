<script>
   import U from "@/U";
   export default {
      props: {
         menu: { type: Object },
         isScreenWide: { type: Boolean, default: true },
      },
      computed: {
         title: (c) => c.menu.title,
         icon: (c) => c.menu.icon,
         count: (c) => c.menu.count,
         primaryColor: (c) => c.menu.primaryColor ?? "black",
      },
      methods: {
         isSelected() {
            const { menu } = this;

            if (!U.isFunction(menu.isSelected)) return false;

            return menu.isSelected(menu);
         },
         click() {
            if (!U.isFunction(this.menu.click)) return;
            this.menu.click(this.menu);
         },
      },
   };
</script>

<template>
   <button
      :class="['PanelItems-TabLayout-Tab', 'transition']"
      :style="{ '--primary-color': primaryColor }"
      :isExpand="`${isSelected() || isScreenWide}`"
      :isSelected="`${isSelected()}`"
      @click="() => click()"
   >
      <img v-if="icon" class="PanelItems-TabLayout-Tab-icon" :src="icon" />
      <span
         v-if="title.length"
         :class="['PanelItems-TabLayout-Tab-title', 'transition']"
         >{{ title }}</span
      >
      <span
         v-if="typeof count === 'number'"
         class="PanelItems-TabLayout-Tab-count"
         >({{ count }})</span
      >
   </button>
</template>

<style lang="scss" scoped>
   .PanelItems-TabLayout-Tab {
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

      .PanelItems-TabLayout-Tab-icon {
         z-index: 2;
         width: 1.5rem;
         height: 1.5rem;
         padding: 0.25rem;
      }
      .PanelItems-TabLayout-Tab-title {
         z-index: 1;
         text-align: start;
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         font-weight: 600;
         transition-timing-function: cubic-bezier(1, 0, 0, 1);
      }
      .PanelItems-TabLayout-Tab-count {
         min-width: max-content;
         font-size: 0.8em;
      }
   }

   .PanelItems-TabLayout-Tab[isExpand="true"] {
      width: 10rem;
      width: 9rem;
      gap: 0.2rem;
   }
   .PanelItems-TabLayout-Tab[isExpand="false"] {
      width: 4rem;
      gap: 0;
      .PanelItems-TabLayout-Tab-title {
         width: 0;
         height: 0;
         opacity: 0;
      }
   }

   .PanelItems-TabLayout-Tab[isSelected="true"] {
      background: var(--primary-color);
      color: white;
   }
   .PanelItems-TabLayout-Tab[isSelected="false"] {
      background: none;
      cursor: pointer;
      color: var(--primary-color);

      &:hover {
         background-color: #e2e2e2;
      }
   }
</style>
