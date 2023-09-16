<script>
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import GlobalSearch from "@/app/search/GlobalSearch.vue";
  import SearchIcon from "@/assets/icon/search-000000.svg";

  export default {
    props: { isWide: { type: Boolean, default: false } },
    components: { ButtonIcon, GlobalSearch },
    data() {
      return { SearchIcon };
    },
    methods: {
      focus() {
        this.$refs.globalsearch.focus();
      },
    },
  };
</script>

<template>
  <div class="NavigationDrawer-Search" :isWide="`${isWide}`">
    <ButtonIcon
      class="NavigationDrawer-Search-button"
      v-if="!isWide"
      :src="SearchIcon"
      @click="
        () => {
          if (!$store.getters.navigation.isWide()) {
            $store.getters.navigation.openNavigationDrawer();
          }
        }
      "
    />

    <GlobalSearch
      class="NavigationDrawer-Search-comp"
      ref="globalsearch"
      @expand="() => $emit('expand')"
      @collapse="() => $emit('collapse')"
    />
  </div>
</template>

<style lang="scss" scoped>
  .NavigationDrawer-Search {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: auto;
    .NavigationDrawer-Search-comp {
      --background-color: hsl(0, 0%, 94%);
      --border-radius: 0.8rem;
      --border: 1px solid hsla(0, 0%, 0%, 0.15);
      --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
      --dropdown-height: calc(100dvh - 10rem);
    }
  }
  .NavigationDrawer-Search[isWide="true"] {
    margin: 0 0.7rem;
  }
</style>
