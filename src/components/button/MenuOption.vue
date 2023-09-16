<script setup lang="ts">
  import { computed } from "vue";
  import MenuIcon from "@/components/MenuIcon.vue";
  import U from "@/U";
  import chroma from "chroma-js";

  import IconOptionLight from "@/assets/icon/option-FFFFFF.svg";
  import IconOptionDark from "@/assets/icon/option-000000.svg";

  const props = defineProps({
    menus: { default: undefined },
    primaryColor: { default: () => chroma("ffffff") },
  });

  const isDark = computed(() => U.isColorDark(props.primaryColor, 60));
</script>

<template>
  <MenuIcon
    :menus="menus"
    :src="isDark ? IconOptionLight : IconOptionDark"
    @show="() => $emit('show')"
    @hide="() => $emit('hide')"
  />
</template>
