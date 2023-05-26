<script>
   import Selector from "@/components/selector/Selector.vue";

   export default {
      components: { Selector },
      props: {
         item: { type: Object },
      },
      data: (c) => ({}),
      computed: {
         title: (c) => c.item.title,

         menus: (c) => {
            return c.item.items.map((subItem) => {
               return {
                  key: subItem.title,
                  title: subItem.title,
                  isSelected: () => subItem.isSelected(),
               };
            });
         },

         selectedKey: (c) => {
            const menu = c.menus.find((menu) => menu.isSelected());
            return menu?.key ?? "";
         },
      },
      methods: {
         clickMenu(key) {
            const menu = this.menus.find((menu) => menu.title === key);
            if (!menu) return;

            const item = this.item.items.find((item) => {
               return item.title === menu.key;
            });

            item?.click() ?? null;
         },
      },
   };
</script>

<template>
   <div class="PanelOption-Item">
      <span>{{ title }}</span>
      <Selector
         :list="menus"
         :keySelected="selectedKey"
         @callback-select="(key) => clickMenu(key)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .PanelOption-Item {
      width: 100%;
      gap: 0.5rem;
      text-align: start;

      display: flex;
      flex-direction: column;
      align-items: stretch;
   }
</style>
