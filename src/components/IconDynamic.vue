<script lang="ts">
  import chroma from "chroma-js";
  import Icon from "./Icon.vue";
  import U from "@/U";
  import Vue from "vue";

  export default Vue.extend({
    components: { Icon },
    props: {
      srcLight: { type: String, default: "" },
      srcDark: { type: String, default: "" },
      primaryColor: { default: () => chroma("ffffff") },
      alt: { type: String, default: "" },
    },
    computed: {
      isDark() {
        return U.isColorDark(this.primaryColor, 60);
      },
    },
  });
</script>

<template>
  <Icon :src="isDark ? srcLight : srcDark" :alt="alt" />
</template>
