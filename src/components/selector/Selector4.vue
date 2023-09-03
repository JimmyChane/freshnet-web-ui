<script lang="ts">
  import U from "@/U";
  import Vue from "vue";
  import Item from "./Selector4-Item.vue";

  export default Vue.extend({
    components: { Item },
    props: {
      menus: { type: Array },
      defaultKey: { type: String, default: "" },
      selectedKey: { type: String, default: "" },
    },
    computed: {
      Menus(): any[] {
        return U.optArray(this.menus).map((menu) => menu);
      },
      DefaultKey(): string {
        return U.optString(this.defaultKey);
      },
      DefaultMenu(): any {
        return this.Menus.find((menu) => menu.key === this.DefaultKey);
      },
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

      setSelectedMenu(menu: any) {
        if (menu) this.$emit("click-menu", menu);
      },
    },
  });
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
