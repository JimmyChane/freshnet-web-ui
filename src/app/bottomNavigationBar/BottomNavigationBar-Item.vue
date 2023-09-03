<script lang="ts">
  import U from "@/U";
  import NavPage from "@/app/NavPage";
  import IconHome from "@/icon/IconHome.vue";
  import IconProducts from "@/icon/IconMagnifyingGlass.vue";
  import IconPaper from "@/icon/IconPaper.vue";
  import IconManage from "@/icon/IconManage.vue";
  import Vue from "vue";

  export default Vue.extend({
    components: { IconHome, IconProducts, IconPaper, IconManage },
    props: { item: { type: NavPage } },
    computed: {
      key(): string {
        return this.item.key;
      },
      isSelected(): boolean {
        if (typeof this.item.isSelected === "function") {
          return this.item.isSelected();
        }
        return false;
      },
    },
  });
</script>

<template>
  <router-link
    class="BottomNavigationBar-Item"
    :to="`/${item.key}`"
    :isSelected="`${isSelected}`"
  >
    <IconHome
      class="BottomNavigationBar-Item-icon"
      v-if="key === 'home'"
      :isSelected="isSelected"
    />
    <IconProducts
      class="BottomNavigationBar-Item-icon"
      v-else-if="key === 'product'"
      :isSelected="isSelected"
    />
    <IconPaper
      class="BottomNavigationBar-Item-icon"
      v-else-if="key === 'print'"
      :isSelected="isSelected"
    />
    <IconManage
      class="BottomNavigationBar-Item-icon"
      v-else-if="key === 'manage'"
      :isSelected="isSelected"
    />
    <img
      v-else
      :class="['BottomNavigationBar-Item-icon', 'transition']"
      :src="isSelected ? item.icon.light : item.icon.dark"
      :alt="`Go to ${item.title}`"
    />
    <span :class="['BottomNavigationBar-Item-title', 'transition']">{{
      item.title
    }}</span>
  </router-link>
</template>

<style lang="scss" scoped>
  .BottomNavigationBar-Item {
    --primary-color: #1673e1;
    --secondary-color: hsla(213, 82%, 48%, 0.2);
    --third-color: hsla(213, 82%, 48%, 0.1);
    --icon-size: 1.8em;
    --padding: 0.4em;
    --padding-inline: 1em;
    --gap: 0.7em;

    background: none;
    border: none;
    color: inherit;
    text-decoration: inherit;
    padding: var(--padding);
    padding-inline: var(--padding-inline);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-size: 1rem;
    border-radius: 2em;
    font-weight: 600;
    transition: all 200ms cubic-bezier(1, 0, 0, 1);
    position: relative;
    overflow: hidden;

    .BottomNavigationBar-Item-icon {
      width: var(--icon-size);
      height: var(--icon-size);
      padding: 0.2em;
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
    }
    .BottomNavigationBar-Item-title {
      min-width: max-content;
      position: absolute;
      left: calc(var(--padding-inline) + var(--icon-size) + var(--gap));
      font-size: 0.9em;
      color: var(--primary-color);
    }
  }

  .BottomNavigationBar-Item[isSelected="true"] {
    cursor: initial;
    flex-grow: 1;
    background: var(--secondary-color);

    .BottomNavigationBar-Item-icon {
      --color: var(--primary-color);
    }

    @media (max-width: 350px) {
      flex-grow: 0;
      .BottomNavigationBar-Item-title {
        opacity: 0;
      }
    }
  }
  .BottomNavigationBar-Item[isSelected="false"] {
    cursor: pointer;
    flex-grow: 0;

    .BottomNavigationBar-Item-icon {
      --primary-color: #1673e1;
      --secondary-color: #00000080;
    }
    .BottomNavigationBar-Item-title {
      opacity: 0;
    }

    &:hover,
    &:focus {
      background: var(--third-color);
    }
  }
</style>
