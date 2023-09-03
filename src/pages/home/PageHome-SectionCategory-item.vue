<script lang="ts">
  import Category from "@/items/Category";
  import Vue from "vue";

  export default Vue.extend({
    props: {
      category: { type: Category },
      productCount: { type: Number, default: 0 },
    },
    computed: {
      title(): string {
        return this.category.title;
      },
      subtitle(): string {
        if (this.productCount === 1) return "1 Product";
        if (this.productCount > 1) return `${this.productCount} Products`;
        return "";
      },
      icon(): string {
        return this.category.icon?.toUrl() ?? "";
      },
      background(): string {
        return this.category.background?.toUrl() ?? "";
      },

      to(): Object {
        return { path: "/product", query: { category: this.category.id } };
      },
    },
  });
</script>

<template>
  <router-link class="SectionCategory-item transition" :to="to">
    <img
      class="SectionCategory-item-background"
      v-if="background.length"
      :src="background"
      :alt="`${title} background`"
    />
    <div class="SectionCategory-item-gradient transition" />
    <span class="SectionCategory-item-title">{{ title }}</span>
    <span class="SectionCategory-item-count">{{ subtitle }}</span>
  </router-link>
</template>

<style lang="scss" scoped>
  .SectionCategory-item {
    height: 6rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    text-decoration: none;
    font-size: 1rem;
    color: white;
    overflow: hidden;

    position: relative;

    &:hover {
      .SectionCategory-item-gradient {
        transform: translateX(0);
      }
    }

    & > * {
      z-index: 1;
    }
    .SectionCategory-item-title {
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    .SectionCategory-item-count {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
    }
    .SectionCategory-item-background {
      z-index: 0;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      object-fit: cover;
    }
    .SectionCategory-item-gradient {
      z-index: 0;
      height: 100%;
      width: 150%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: linear-gradient(120deg, #000000, transparent);
      transform: translateX(-25%);
    }
  }
</style>
