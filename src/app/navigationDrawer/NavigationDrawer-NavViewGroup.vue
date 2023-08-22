<script>
  import NavigationLeftClickable from "./NavigationDrawer-Clickable.vue";

  export default {
    components: { NavigationLeftClickable },
    props: {
      group2: { type: Object, default: () => null },
    },
    computed: {
      title: (c) => c.group2.title,
      group3s: (c) => c.group2.groups,
      isWide: (c) => c.group2.isWide(),
    },
  };
</script>

<template>
  <div class="NavViewGroup" :isWide="`${isWide}`">
    <span class="NavViewGroup-title" v-if="isWide && title">{{ title }}</span>

    <div class="NavViewGroup-groups" v-if="group3s">
      <div v-for="group3 of group3s" :key="group3.key">
        <NavigationLeftClickable
          v-if="!group3.getParent().isQuery"
          :item="group3"
          :href="group3.getLink()"
          @click="() => group3.click()"
        />
        <NavigationLeftClickable
          v-if="group3.getParent().isQuery"
          :item="group3"
          @click="() => group3.click()"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .NavViewGroup {
    display: flex;
    flex-direction: column;

    .NavViewGroup-title {
      width: fit-content;
      margin-left: 0.4em;
      padding: 0.6rem 1rem;

      font-size: 0.7em;
      font-weight: 600;
      opacity: 1;
      letter-spacing: 0.3em;
      color: var(--primary-color);
      color: hsla(0, 0%, 0%, 0.7);
    }

    .NavViewGroup-groups {
      display: flex;
      flex-direction: column;
      align-items: stretch;

      & > * {
        width: 100%;
      }
    }
  }

  .NavViewGroup[isWide="true"] {
    width: 100%;
    .NavViewGroup-group3s {
      width: 100%;
    }
  }
</style>
