<script>
  import U from "@/U";
  export default {
    props: { item: { type: Object } },
    computed: {
      isSelected: (c) =>
        U.isFunction(c.item.isSelected) ? c.item.isSelected() : false,
    },
  };
</script>

<template>
  <router-link
    class="BottomNavigationBar-Item"
    :to="`/${item.key}`"
    :isSelected="`${isSelected}`"
  >
    <img
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
    height: 100%;
    width: 100%;

    background: none;
    border: none;
    color: inherit;
    text-decoration: inherit;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;

    .BottomNavigationBar-Item-icon {
      width: 3.2rem;
      height: 3rem;
      padding: 0.5rem;
      padding: 0.8rem;
      border-radius: 0.8rem;
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
    }
  }
  .BottomNavigationBar-Item[isSelected="false"] {
    cursor: pointer;
    .BottomNavigationBar-Item-icon {
      margin-top: -0.8em;
      margin-bottom: -0.5em;
      transition-delay: 0.2s;
    }

    &:hover,
    &:focus {
      .BottomNavigationBar-Item-icon {
        margin-top: 0;
        margin-bottom: -1.2em;
      }
      .BottomNavigationBar-Item-title {
        opacity: 0;
      }
    }
  }
  .BottomNavigationBar-Item[isSelected="true"] {
    cursor: initial;
    .BottomNavigationBar-Item-icon {
      background: hsla(0, 0%, 0%, 0.8);
      margin-bottom: -1.2em;
    }
    .BottomNavigationBar-Item-title {
      opacity: 0;
    }
  }
</style>
