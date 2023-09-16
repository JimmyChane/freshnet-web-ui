<script>
   import chroma from "chroma-js";
   import Icon from "./Icon.vue";
   import U from "@/U";
   export default {
      components: { Icon },
      props: {
         srcLight: { type: String, default: "" },
         srcDark: { type: String, default: "" },
         primaryColor: { default: () => chroma("ffffff") },
         alt: { type: String, default: "" },
      },
      computed: { isDark: (c) => U.isColorDark(c.primaryColor, 60) },
   };
</script>

<template>
   <Icon :src="isDark ? srcLight : srcDark" :alt="alt" />
</template>
