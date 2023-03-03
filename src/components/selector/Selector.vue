<script>
   const selectionNone = { key: "", title: "None" };

   import Menu from "@/components/Menu.vue";
   import U from "@/U";

   export default {
      components: { Menu },
      emits: ["callback-select"],
      props: {
         list: { type: Array, default: () => [] },
         keySelected: { type: String, default: "" },
      },
      data: (c) => ({ isShow: false, menus: [], shouldShowIcon: false }),
      computed: {
         menuCorner: (c) => Menu.Corner.BOTTOM,
         menuWidth: (c) => Menu.Width.SAME,

         currentMenu: (c) => {
            const menu = c.menus.find((menu) => menu.isSelected());
            if (menu) return menu;
            return selectionNone;
         },
         currentIcon: (c) => {
            const item = c.list.find((item) => item.key === c.currentMenu.key);
            const icon = item.icon;
            if (icon) return icon.white;
            return "";
         },
         currentColor: (c) => {
            if (!c.currentMenu || !U.isString(c.currentMenu.primaryColor))
               return "hsl(0, 0%, 96%)";
            return c.currentMenu.primaryColor;
         },
         currentFontColor: (c) => {
            if (!c.currentMenu || !U.isString(c.currentMenu.primaryColor)) return "black";
            return U.isColorDark(c.currentColor, 80) ? "white" : "black";
         },
      },
      watch: {
         list() {
            this.invalidate();
         },
      },
      mounted() {
         const spinnerButton = this.$refs["Selector-button"].$el;
         spinnerButton.addEventListener("focusout", () => {
            setTimeout(() => (this.isShow = false), 100);
         });

         this.invalidate();
      },
      methods: {
         invalidate() {
            this.shouldShowIcon = false;
            this.menus = this.list.map((item) => {
               this.shouldShowIcon = !this.shouldShowIcon ? item.icon : true;
               return {
                  key: item.key,
                  title: item.title,
                  icon: U.isObject(item.icon) ? item.icon.color : "",
                  primaryColor: item.color,
                  isSelected: () => item.key === this.keySelected,
                  click: () => this.$emit("callback-select", item.key),
               };
            });

            if (!this.shouldShowIcon) {
               for (const menu of this.menus) menu.icon = undefined;
            }

            this.$emit("callback-select", this.currentMenu.key);
         },
      },
   };
</script>

<template>
   <Menu
      :class="[
         'transition',
         'Selector',
         isShow ? 'Selector-isSelected' : 'Selector-isDeselected',
      ]"
      :style="{ '--primary-color': currentColor, '--color': currentFontColor }"
      :corner="menuCorner"
      :width="menuWidth"
      :menus="menus"
      :primaryColor="currentColor"
      ref="Selector-button"
      @show="() => (isShow = true)"
      @hide="() => (isShow = false)"
   >
      <img
         class="Selector-icon transition"
         v-if="shouldShowIcon && currentIcon"
         :style="{ opacity: currentIcon ? '1' : '0' }"
         :src="currentIcon"
      />
      <span class="Selector-title transition">
         {{ currentMenu.title }}
      </span>
      <div class="Selector-separator transition" />
      <img
         class="Selector-arrow"
         :src="host.res(`icon/arrow_down-${currentColor ? 'white' : 'black'}.svg`)"
         :style="{ transform: [isShow ? 'rotate(-180deg)' : 'rotate(0deg)'] }"
      />
   </Menu>
</template>

<style lang="scss" scoped>
   .Selector {
      --border-radius: 6px;

      width: 100%;
      padding: 0.6em 1em;
      gap: 0.6em;

      color: var(--color);
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: var(--border-radius);
      background-color: var(--primary-color);

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: stretch;

      border-radius: 6px;
      font-weight: 400;
      font-size: 1rem;
      text-align: start;
      overflow: hidden;

      --icon-size: 1.25rem;

      .Selector-icon {
         width: var(--icon-size);
         height: var(--icon-size);
         padding: 0.1rem;
      }
      .Selector-title {
         flex-grow: 100;
      }
      .Selector-separator {
         min-width: 2px;
         min-height: 100%;
         background-color: hsla(0, 0%, 0%, 0.1);
         display: flex;
         flex-direction: row;
      }
      .Selector-arrow {
         width: var(--icon-size);
         height: var(--icon-size);
         padding: 0.3rem;
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;
      }
   }

   .Selector-isDeselected {
      &:hover {
         background-color: var(--primary-color);
      }
   }
</style>
