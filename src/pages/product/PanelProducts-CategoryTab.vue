<script lang="ts">
  import Vue from "vue";

  interface Tab {
    title: string;
    icon: string;
    background?: string;
    count: number;

    isSelected?: (tab: Tab) => boolean;
    click?: (tab: Tab) => void;
  }

  export default Vue.extend({
    props: {
      menu: { type: Object as () => Tab },
    },
    computed: {
      title(): string {
        return this.menu.title;
      },
      icon(): string {
        return this.menu.icon;
      },
      background(): string {
        return this.menu.background ?? "";
      },
      count(): number {
        return this.menu.count;
      },
    },
    methods: {
      isSelected() {
        const { menu } = this;

        if (typeof menu.isSelected === "function") {
          return menu.isSelected(menu);
        }
        return false;
      },
      click() {
        if (typeof this.menu.click === "function") {
          this.menu.click(this.menu);
        }
        return;
      },
    },
  });
</script>

<template>
  <button
    class="TabLayout-Tab"
    :isWide="`${background.length > 0}`"
    :isSelected="`${isSelected()}`"
    @click="() => click()"
  >
    <img
      class="TabLayout-background"
      v-if="background.length"
      :src="background"
    />
    <div class="TabLayout-tint"></div>
    <span class="TabLayout-Tab-title">{{ title }}</span>
  </button>
</template>

<style lang="scss" scoped>
  .TabLayout-Tab {
    height: 3.4em;
    height: 3em;
    border: none;
    border-radius: 1em;
    font-size: 1em;
    padding: 1.2em;

    display: flex;
    flex-direction: row;
    align-items: center;

    position: relative;

    .TabLayout-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    .TabLayout-tint {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border-radius: 0.9em;
      border: 1px solid hsla(0, 0%, 0%, 0.1);
    }
    .TabLayout-Tab-title {
      z-index: 1;
      text-align: start;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 600;
    }
  }

  .TabLayout-Tab[isSelected="true"] {
    color: white;

    .TabLayout-tint {
      background: var(--background-select);
    }
  }
  .TabLayout-Tab[isSelected="false"] {
    color: black;
    cursor: pointer;

    .TabLayout-tint {
      background: var(--background-deselect);
    }

    &:hover {
      background: #e2e2e2;
    }
  }

  .TabLayout-Tab[isWide="true"] {
    width: 9em;
    justify-content: flex-start;

    --background-select: linear-gradient(90deg, #000000 0%, #000000cc 100%);
    --background-deselect: linear-gradient(90deg, #ffffff 0%, #ffffffcc 100%);
  }
  .TabLayout-Tab[isWide="false"] {
    width: max-content;
    justify-content: center;

    --background-select: #000000e6;
    --background-deselect: #ffffffe6;
  }
</style>
