<script setup lang="ts">
import { optArray } from '@chanzor/utils';
import { computed } from 'vue';

import ButtonIcon from '@/components/button/ButtonIcon.vue';
import ButtonText from '@/components/button/ButtonText.vue';
import MenuOption from '@/components/button/MenuOption.vue';

const props = withDefaults(defineProps<{ menus?: any[] }>(), {
  menus: () => [],
});

const Menus = computed(() =>
  optArray(props.menus).filter((menu) => typeof menu === 'object' && menu),
);
const visibleMenus = computed(() => {
  return Menus.value.filter((menu) => {
    if (typeof menu.isHidden !== 'boolean') return true;
    return !menu.isHidden;
  });
});
const hiddenMenus = computed(() => {
  return Menus.value.filter((menu) => {
    if (typeof menu.isHidden !== 'boolean') return false;
    return menu.isHidden;
  });
});
</script>

<template>
  <div class="ActionBar2Menus" v-if="menus.length">
    <div
      class="ActionBar2Menus-menu"
      v-for="menu in visibleMenus"
      :key="menu.key"
    >
      <ButtonIcon
        class="ActionBar2Menus-menu-icon"
        v-if="menu.icon !== undefined"
        :src="menu.icon"
        :alt="menu.title"
        :href="menu.href"
        :target="menu.target"
        :to="menu.to"
        @click="
          () => {
            if (typeof menu.click === 'function') menu.click();
          }
        "
      />
      <ButtonText
        v-else-if="menu.title !== undefined"
        class="ActionBar2Menus-menu-textButton"
        :text="menu.title"
        :href="menu.href"
        :target="menu.target"
        :to="menu.to"
        @click="
          () => {
            if (typeof menu.click === 'function') menu.click();
          }
        "
      />
    </div>
    <MenuOption
      :style="{ 'font-size': '1em' }"
      v-if="hiddenMenus.length"
      :menus="hiddenMenus"
    />
  </div>
</template>

<style lang="scss" scoped>
.ActionBar2Menus {
  width: 100%;
  min-width: max-content;
  max-width: max-content;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 0;
  align-items: center;
  justify-content: flex-end;

  .ActionBar2Menus-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    & > * {
      font-size: 1em;
    }

    .ActionBar2Menus-menu-textButton {
      color: inherit;
    }
  }
}
</style>
