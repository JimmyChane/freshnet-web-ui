<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import GlobalSearch from "@/app/GlobalSearch.vue";

   export default {
      props: { isWide: { type: Boolean, default: false } },
      components: { ButtonIcon, GlobalSearch },
   };
</script>

<template>
   <div :class="['LeftNav-Search', isWide ? 'LeftNav-Search-isWide' : '']">
      <ButtonIcon
         class="LeftNav-Search-button"
         v-if="!isWide"
         :src="host.res('icon/search-000000.svg')"
         @click="
            () => {
               if (!$root.navigation.isWide()) {
                  $root.navigation.openNavigationDrawer();
               }
            }
         "
      />

      <GlobalSearch class="LeftNav-Search-comp" />
   </div>
</template>

<style lang="scss" scoped>
   .LeftNav-Search {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: auto;
      .LeftNav-Search-comp {
         --background-color: hsl(0, 0%, 94%);
         --border-radius: 0.8rem;
         --border: 1px solid transparent;
         --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
         --dropdown-height: calc(100vh - 10rem);
      }
   }
   .LeftNav-Search-isWide {
      margin: 0 1.2rem;
   }
</style>
