<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import GlobalSearch from "@/app/search/GlobalSearch.vue";

   export default {
      props: { isWide: { type: Boolean, default: false } },
      components: { ButtonIcon, GlobalSearch },
      methods: {
         focus() {
            this.$refs.globalsearch.focus();
         },
      },
   };
</script>

<template>
   <div class="NavigationLeft-Search" :isWide="`${isWide}`">
      <ButtonIcon
         class="NavigationLeft-Search-button"
         v-if="!isWide"
         :src="host.icon('search-000000')"
         @click="
            () => {
               if (!store.getters.navigation.isWide()) {
                  store.getters.navigation.openNavigationDrawer();
               }
            }
         "
      />

      <GlobalSearch
         class="NavigationLeft-Search-comp"
         ref="globalsearch"
         @expand="() => $emit('expand')"
         @collapse="() => $emit('collapse')"
      />
   </div>
</template>

<style lang="scss" scoped>
   .NavigationLeft-Search {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: auto;
      .NavigationLeft-Search-comp {
         --background-color: hsl(0, 0%, 94%);
         --border-radius: 0.8rem;
         --border: 1px solid hsla(0, 0%, 0%, 0.15);
         --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
         --dropdown-height: calc(100dvh - 10rem);
      }
   }
   .NavigationLeft-Search[isWide="true"] {
      margin: 0 0.7rem;
   }
</style>
