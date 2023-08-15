<script>
  import Contact from "./PageHome-SectionContact-Group-Item.vue";

  export default {
    components: { Contact },
    props: {
      isThin: { type: Boolean, default: false },
      group: { type: Object },
    },
    computed: {
      title: (c) => c.group.category.title,
      icon: (c) => c.group.category.icon,
      items: (c) => c.group.items,
    },
  };
</script>

<template>
  <div :class="['ContactGroup', 'transition']" :isThin="`${isThin}`">
    <div class="ContactGroup-icon" :style="{ 'grid-area': 'icon' }">
      <img :src="icon" :alt="title" />
    </div>
    <span class="ContactGroup-title" :style="{ 'grid-area': 'title' }">{{
      title
    }}</span>
    <div class="ContactGroup-main" :style="{ 'grid-area': 'main' }">
      <Contact v-for="item of items" :key="item.title" :item="item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ContactGroup {
    --icon-size: 2.2em;

    overflow: hidden;
    color: black;
    text-decoration: none;
    position: relative;

    width: 100%;
    height: 100%;
    padding: 1em;
    border-radius: 1em;
    gap: 1em;

    display: grid;
    grid-template-areas:
      "icon title"
      "main main";
    grid-template-columns: var(--icon-size) 1fr;
    grid-template-rows: 1fr;

    .ContactGroup-icon {
      width: var(--icon-size);
      height: var(--icon-size);

      padding: 0.2em;
      background: white;
      border-radius: 50%;

      display: grid;
      place-items: center;

      img {
        width: 60%;
        height: 60%;
      }
    }
    .ContactGroup-title {
      font-size: 1.2em;
      align-self: center;
    }
    .ContactGroup-main {
      flex-grow: 1;
      height: 100%;
      gap: 0.2em;

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }
</style>
