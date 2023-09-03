<script lang="ts">
  import U from "@/U";
  import Vue from "vue";
  import Menus from "./Actionbar-Menus.vue";

  export default Vue.extend({
    components: { Menus },
    props: {
      title: { type: String, default: "" },
      leftMenus: { default: () => [] },
      rightMenus: { default: () => [] },
    },
    computed: {
      LeftMenus(): any[] {
        return this.parseMenus(this.leftMenus);
      },
      RightMenus(): any[] {
        return this.parseMenus(this.rightMenus);
      },
      hasSlot(): boolean {
        return !this.$slots.footer;
      },
    },
    methods: {
      parseMenus(menus: any[]) {
        if (Array.isArray(menus)) {
          return menus.filter((menu) => U.optObjectOnly(menu));
        }
        if (typeof menus === "object") {
          return [menus];
        }
        return [];
      },
    },
  });
</script>

<template>
  <div class="Actionbar transition">
    <Menus :style="{ 'justify-content': 'flex-start' }" :menus="LeftMenus" />
    <span class="Actionbar-title" v-if="title">{{ title }}</span>
    <slot v-if="hasSlot" />
    <Menus :style="{ 'justify-content': 'flex-end' }" :menus="RightMenus" />
  </div>
</template>

<style lang="scss" scoped>
  .Actionbar {
    color: black;
    background: white;
    border-bottom: 1px solid hsl(0, 0%, 90%);

    position: sticky;
    top: 0;

    --height: 3.8rem;

    width: 100%;
    height: var(--height);
    min-height: var(--height);
    max-height: var(--height);
    padding: 0.4rem;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

    .Actionbar-title {
      font-size: 1.5rem;
      white-space: nowrap;
      text-overflow: clip;
      color: inherit;

      margin: 0 0.8rem;
      overflow: hidden;

      display: flex;
      flex-direction: row;
      flex-grow: 1;
      align-items: center;
      justify-content: flex-start;
    }
  }
</style>
