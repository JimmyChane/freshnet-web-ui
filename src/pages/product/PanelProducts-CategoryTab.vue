<script>
   import U from "@/U";
   export default {
      props: { menu: { type: Object } },
      computed: {
         title: (c) => c.menu.title,
         icon: (c) => c.menu.icon,
         background: (c) => c.menu.background ?? "",
         count: (c) => c.menu.count,
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
      class="TabLayout-Tab"
      :isWide="`${background.length > 0}`"
      :isSelected="`${isSelected()}`"
      @click="() => click()"
   >
      <img
         class="TabLayout-background"
         v-if="background.length"
         :src="background"
      />
      <div class="TabLayout-tint"></div>
      <span class="TabLayout-Tab-title">{{ title }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .TabLayout-Tab {
      height: 3.4em;
      border: none;
      border-radius: 1em;
      font-size: 1em;
      padding: 1.2em;

      display: flex;
      flex-direction: row;
      align-items: center;

      position: relative;

      .TabLayout-background {
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         object-fit: cover;
         border-radius: inherit;
      }
      .TabLayout-tint {
         position: absolute;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         pointer-events: none;
         border-radius: 0.9em;
         border: 1px solid hsla(0, 0%, 0%, 0.1);
      }
      .TabLayout-Tab-title {
         z-index: 1;
         text-align: start;
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         font-weight: 600;
      }
   }

   .TabLayout-Tab[isSelected="true"] {
      color: white;

      .TabLayout-tint {
         background: var(--background-select);
      }
   }
   .TabLayout-Tab[isSelected="false"] {
      color: black;
      cursor: pointer;

      .TabLayout-tint {
         background: var(--background-deselect);
      }

      &:hover {
         background: #e2e2e2;
      }
   }

   .TabLayout-Tab[isWide="true"] {
      width: 9em;
      justify-content: flex-start;

      --background-select: linear-gradient(90deg, #000000 0%, #000000cc 100%);
      --background-deselect: linear-gradient(90deg, #ffffff 0%, #ffffffcc 100%);
   }
   .TabLayout-Tab[isWide="false"] {
      width: max-content;
      justify-content: center;

      --background-select: #000000e6;
      --background-deselect: #ffffffe6;
   }
</style>
