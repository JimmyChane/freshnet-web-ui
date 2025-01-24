<script>
import { optArray, optString } from '@/U';

import ItemMenu from './Selector3/ItemMenu.vue';

export default {
  emits: ['click-menu'],
  components: { ItemMenu },
  props: {
    menus: { type: Array },
    defaultKey: { type: String, default: '' },
    selectedKey: { type: String, default: '' },
  },
  computed: {
    Menus: (c) => optArray(c.menus).map((menu) => menu),
    DefaultKey: (c) => optString(c.defaultKey),
    DefaultMenu: (c) => c.Menus.find((menu) => menu.key === c.DefaultKey),
  },
  watch: {
    DefaultMenu() {
      this.invalidateDefaultMenu();
    },
  },
  mounted() {
    this.invalidateDefaultMenu();
  },
  methods: {
    invalidateDefaultMenu() {
      this.setSelectedMenu(this.DefaultMenu);
    },

    setSelectedMenu(menu) {
      if (menu) this.$emit('click-menu', menu);
    },
  },
};
</script>

<template>
  <div class="Selector3">
    <div class="Selector3-menus">
      <ItemMenu
        v-for="menu of Menus"
        :key="menu.key"
        :item="menu"
        :isSelected="menu.key === selectedKey"
        @click="setSelectedMenu(menu)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Selector3-separator {
  min-width: 1px;
  height: 100%;
  max-height: calc(100% - 0.8rem);
  background: hsl(0, 0%, 90%);
  margin-left: 0.8rem;
  margin-right: 0.8rem;
}
.Selector3 {
  display: flex;
  flex-direction: column;
  .Selector3-menus {
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 0.2rem;
  }
}
</style>
