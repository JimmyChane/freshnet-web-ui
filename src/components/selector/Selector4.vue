<script>
import { optArray, optString } from '@/U';

import Item from './Selector4-Item.vue';

export default {
  emits: ['click-menu'],
  components: { Item },
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
  <div class="Selector4">
    <Item
      v-for="menu of Menus"
      :key="menu.key"
      :title="menu.title"
      :icon="menu.icon"
      :isSelected="menu.key === selectedKey"
      @click="setSelectedMenu(menu)"
    />
  </div>
</template>

<style lang="scss" scoped>
.Selector4 {
  gap: 0.2rem;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}
</style>
