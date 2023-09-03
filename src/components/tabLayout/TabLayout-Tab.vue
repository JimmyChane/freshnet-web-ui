<script lang="ts">
  import Vue from "vue";

  interface Menu {
    title: string;
    icon: string;
    count: number;
    primaryColor?: string;
    primaryColorTint?: string;

    isSelected: ((menu: Menu) => boolean) | boolean;
    click?: (menu: Menu) => void;
  }

  export default Vue.extend({
    props: {
      menu: { type: Object as () => Menu },
      isScreenWide: { type: Boolean, default: true },
    },
    computed: {
      title(): string {
        return this.menu.title;
      },
      icon(): string {
        return this.menu.icon;
      },
      count(): number {
        return this.menu.count;
      },
      primaryColor(): string {
        return this.menu.primaryColor ?? "black";
      },
      primaryColorTint(): string {
        return this.menu.primaryColorTint ?? "transparent";
      },
    },
    methods: {
      isSelected(): boolean {
        if (typeof this.menu.isSelected === "function") {
          return this.menu.isSelected(this.menu);
        }
        return false;
      },
      click(): void {
        if (typeof this.menu.click === "function") {
          this.menu.click(this.menu);
        }
      },
    },
  });
</script>

<template>
  <button
    :class="['TabLayout-Tab', 'transition']"
    :style="{
      '--primary-color': primaryColor,
      '--primary-color-tint': primaryColorTint,
    }"
    :isExpand="`${isSelected() || isScreenWide}`"
    :isSelected="`${isSelected()}`"
    @click="() => click()"
  >
    <img v-if="icon" class="TabLayout-Tab-icon" :src="icon" />
    <span v-if="title.length" :class="['TabLayout-Tab-title', 'transition']">{{
      title
    }}</span>
    <span v-if="typeof count === 'number'" class="TabLayout-Tab-count"
      >({{ count }})</span
    >
  </button>
</template>

<style lang="scss" scoped>
  .TabLayout-Tab {
    --primary-color: inherit;

    height: 2.4rem;
    border: none;
    border-radius: 0.8rem;
    font-size: 1rem;
    padding: 0.6rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    transition-timing-function: cubic-bezier(1, 0, 0, 1);

    .TabLayout-Tab-icon {
      z-index: 2;
      width: 1.5rem;
      height: 1.5rem;
      padding: 0.25rem;
    }
    .TabLayout-Tab-title {
      z-index: 1;
      text-align: start;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 600;
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
      font-size: 0.9em;
    }
    .TabLayout-Tab-count {
      min-width: max-content;
      font-size: 0.8em;
    }
  }

  .TabLayout-Tab[isExpand="true"] {
    width: 10rem;
    width: 9rem;
    gap: 0.2rem;
  }
  .TabLayout-Tab[isExpand="false"] {
    width: 4rem;
    gap: 0;
    .TabLayout-Tab-title {
      width: 0;
      height: 0;
      opacity: 0;
    }
  }

  .TabLayout-Tab[isSelected="true"] {
    background: var(--primary-color);
    color: white;
  }
  .TabLayout-Tab[isSelected="false"] {
    cursor: pointer;
    background: var(--primary-color-tint);
    color: var(--primary-color);

    &:hover {
      background: #e2e2e2;
    }
  }
</style>
