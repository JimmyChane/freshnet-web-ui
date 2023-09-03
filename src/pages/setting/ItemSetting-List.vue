<script lang="ts">
  import U from "@/U";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      item: { type: Object, default: () => null },
    },
    data() {
      return { U, values: [] };
    },
    computed: {
      isLoading(): boolean {
        return this.$store.state.stores.user.getters.isLoading;
      },
    },
    watch: {
      "$store.state.stores.setting.getters.lastModified"() {
        this.invalidateValue();
      },
      item() {
        this.invalidateValue();
      },
    },
    mounted() {
      this.invalidateValue();
    },
    methods: {
      invalidateValue() {
        const setting = this.item.findValue();
        this.values = setting?.value ?? [];
      },
    },
  });
</script>

<template>
  <div class="ItemSetting-List">
    <span class="ItemSetting-List-item" v-for="value of values" :key="value">{{
      value
    }}</span>
    <span class="ItemSetting-List-empty" v-if="!values.length">Empty</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSetting-List {
    padding: 1rem;
    gap: 0.2rem;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: white;

    .ItemSetting-List-item {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 0.5rem;
      border-radius: 0.3rem;
      font-size: 0.9rem;
    }
    .ItemSetting-List-empty {
      font-size: 0.8rem;
      color: hsl(0, 0%, 75%);
    }
  }
</style>
