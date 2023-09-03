<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    name: "ItemObject",
    props: {
      item: {},
    },
    computed: {
      itemKeys(): string[] {
        return this.keys(this.item);
      },
    },
    methods: {
      shouldIncludeNextLine(item: Object, key: string): boolean {
        const x =
          this.isArray(item) &&
          this.itemKeys.indexOf(key) < this.itemKeys.length - 1;
        const y =
          this.isObject(item) &&
          this.itemKeys.indexOf(key) !== this.itemKeys.length - 1;
        return x || y;
      },
      keys(value: any): string[] {
        return value !== undefined && value !== null ? Object.keys(value) : [];
      },
      isNull(value: any): boolean {
        return value === null;
      },
      isArray(value: any): boolean {
        return Array.isArray(value);
      },
      isObject(value: any): boolean {
        return typeof value === "object";
      },
      isBoolean(value: any): boolean {
        return typeof value === "boolean";
      },
      isNumber(value: any): boolean {
        return typeof value === "number";
      },
      isString(value: any): boolean {
        return typeof value === "string";
      },
    },
  });
</script>

<template>
  <div class="ItemObject">
    <span class="ItemObject-property" v-for="key in itemKeys" :key="key">
      <span class="ItemObject-key" v-if="!isArray(item)">"{{ key }}"</span>

      <span class="ItemObject-separator" v-if="!isArray(item)">:</span>

      <span class="ItemObject-value" v-if="isNull(item[key])">null</span>
      <span class="ItemObject-value" v-else-if="isArray(item[key])"
        >{{ "[" }}<ItemObject v-if="item[key].length" :item="item[key]" />{{
          "]"
        }}</span
      >
      <span class="ItemObject-value" v-else-if="isObject(item[key])"
        >{{ "{" }}<ItemObject v-if="itemKeys.length" :item="item[key]" />{{
          "}"
        }}</span
      >
      <span
        class="ItemObject-value"
        v-else-if="isBoolean(item[key]) || isNumber(item[key])"
        >{{ item[key] }}</span
      >
      <span class="ItemObject-value" v-else>{{ `"${item[key]}"` }}</span>

      <span class="ItemObject-nextLine">{{
        shouldIncludeNextLine(item, key) ? "," : ""
      }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemObject {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.2rem;

    border-left: 2px solid hsla(0, 0%, 0%, 0.2);
    border-radius: 0 0.4rem 0.4rem 0;
    padding: 0.2rem;

    .ItemObject-property {
      padding-left: 1rem;
      padding-right: 0.4rem;
      .ItemObject-key {
        --width: 8rem;
        min-width: var(--width);
        max-width: var(--width);
        font-size: 0.8rem;
        color: hsl(0, 0%, 30%);
        word-break: break-all;
      }
      .ItemObject-separator {
        padding-left: 0.5rem;
        padding-right: 1rem;
      }
      .ItemObject-value {
        font-size: 1rem;
        word-break: break-all;
      }
      .ItemObject-nextLine {
        padding-left: 0.5rem;
        padding-right: 1rem;
      }
    }
  }
</style>
