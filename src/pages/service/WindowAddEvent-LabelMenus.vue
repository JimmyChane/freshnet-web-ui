<script>
  const State = { Expand: 1, Collapse: 2 };

  import chroma from "chroma-js";

  export default {
    State,

    props: {
      primaryColor: { type: chroma, default: () => chroma("2ead87") },
      menu: { type: Object, default: () => null },
      menus: { default: () => [] },
    },
    data: (c) => ({ state: State.Collapse }),
    computed: {
      parsedMenus() {
        const menus = Array.isArray(this.menus) ? this.menus : [this.menus];
        return menus.filter((menu) => {
          return typeof menu === "object" && menu !== null;
        });
      },
      isExpand: (c) => c.state === State.Expand,

      menuKey: (c) => c.menu?.key ?? "",
      menuTitle: (c) => c.menu?.title ?? "",
      menuIcon: (c) => c.menu?.icon ?? "",

      primaryColorBackground: (c) => c.primaryColor.mix("ffffff", 0.8),
      primaryColorBackgroundHover: (c) => c.primaryColor.mix("ffffff", 0.6),
      primaryColorBackgroundSelected: (c) => c.primaryColor.mix("ffffff", 0.4),
    },
    methods: {
      toggle() {
        this.isExpand ? this.collapse() : this.expand();
      },
      expand() {
        this.state = State.Expand;
      },
      collapse(timeout = 0) {
        if (timeout > 0) {
          setTimeout(() => this.collapse(), timeout);
          return;
        }
        this.state = State.Collapse;
      },
    },
  };
</script>

<template>
  <div
    :class="[
      'LabelMenus',
      `LabelMenus-${isExpand ? 'isExpand' : 'isCollapse'}`,
    ]"
    :style="{ '--primary-color': primaryColor.toString() }"
  >
    <button
      class="LabelMenus-main"
      @click="() => toggle()"
      @blur="() => collapse(200)"
    >
      <span class="LabelMenus-content">
        <img class="LabelMenus-content-icon" v-if="menuIcon" :src="menuIcon" />
        {{ menuTitle }}</span
      >
      <img
        class="LabelMenus-arrow transition"
        :src="host.icon('arrowDown-FFFFFF')"
      />
    </button>

    <div
      class="LabelMenus-menus scrollbar transition"
      :style="{ 'background-color': primaryColorBackground }"
    >
      <button
        class="LabelMenus-menu transition"
        :style="{
          '--background-color-hover': primaryColorBackgroundHover,
          '--background-color-selected': primaryColorBackgroundSelected,
        }"
        :key="menu.title"
        v-for="menu in parsedMenus"
        :class="[
          menu.key === menuKey
            ? 'LabelMenus-menu-isSelected'
            : 'LabelMenus-menu-isDeselected',
        ]"
        @click="() => menu.click(menu)"
      >
        <img
          class="LabelMenus-menu-icon"
          v-if="menu.icon"
          :src="menu.icon ? menu.icon : ''"
        />
        <span>{{ menu.title }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .LabelMenus {
    --primary-color: #2ead87;

    width: max-content;
    position: relative;
    overflow: visible;
    border-radius: 2rem 0 0 2rem;
    margin: -1px;

    .LabelMenus-main {
      width: max-content;
      height: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: stretch;
      justify-content: stretch;
      position: relative;

      z-index: 1;
      border: none;
      background: none;
      cursor: pointer;

      .LabelMenus-content {
        min-width: max-content;
        background: var(--primary-color);
        padding: 0.4rem 1.2rem;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 2rem 0 0 2rem;
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;

        .LabelMenus-content-icon {
          height: 12px;
        }
      }
      .LabelMenus-arrow {
        --size: 5px;
        width: var(--size);
        height: var(--size);
        position: absolute;
        top: calc(50% - var(--size) * 0.5);
        bottom: 0;
        right: calc(var(--size) * 1.5);
      }
    }

    .LabelMenus-menus {
      z-index: 2;
      width: max-content;
      min-width: 100%;
      max-height: 25rem;
      display: flex;
      flex-direction: column;

      overflow-y: auto;
      position: absolute;
      background: white;
      transform: translateY(-1.25rem);
      border-radius: 0.2rem;
      --transition-timing: cubic-bezier(1, 0, 0, 1);
      padding: 0.625rem 0;
      box-shadow: 0 0 0.625rem 0 hsla(0, 0%, 30%, 0.7);

      --scrollbar-size: 0.3rem;
      --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.2);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.2);
      --scrollbar-track-color: hsla(0, 0%, 0%, 0.08);
      --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.1);

      .LabelMenus-menu {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        row-gap: 0.1;
        column-gap: 0.5rem;
        padding: 0.8rem 1.2rem;
        border: none;
        background: none;
        text-align: start;
        font-size: 0.8rem;
        font-weight: 600;

        --background-color-hover: hsl(0, 0%, 90%);
        --background-color-selected: hsl(0, 0%, 70%);

        .LabelMenus-menu-icon {
          height: 12px;
        }
      }

      .LabelMenus-menu-isSelected {
        background: var(--background-color-selected);
      }
      .LabelMenus-menu-isDeselected {
        cursor: pointer;
        &:hover,
        &:focus {
          background: var(--background-color-hover);
        }
      }
    }
  }
  .LabelMenus-isExpand {
    .LabelMenus-main {
      .LabelMenus-arrow {
        transform: rotate(360deg);
      }
    }
    .LabelMenus-menus {
      transform: translateY(0.25rem);
      opacity: 1;
    }
  }
  .LabelMenus-isCollapse {
    .LabelMenus-main {
      .LabelMenus-arrow {
        transform: rotate(180deg);
      }
    }
    .LabelMenus-menus {
      transform: translateY(-1.25rem);
      pointer-events: none;
      opacity: 0;
    }
  }
</style>
