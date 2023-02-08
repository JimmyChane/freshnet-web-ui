<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import GlobalSearch from "@/app/search/GlobalSearch.vue";

   export default {
      components: { NavigationBar, GlobalSearch },
      props: { isThin: { type: Boolean, default: false } },
   };
</script>

<template>
   <NavigationBar class="HomeActionbar">
      <div class="HomeActionbar-body">
         <GlobalSearch
            :class="[
               'Home-actionbar-search transition',
               isThin
                  ? 'Home-actionbar-search-isThin'
                  : 'Home-actionbar-search-isWide',
            ]"
         />
      </div>
   </NavigationBar>
</template>

<style lang="scss" scoped>
   .HomeActionbar {
      width: 100%;

      --height: max-content;
      background-color: hsl(0, 0%, 89%);

      .HomeActionbar-body {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: center;
         align-items: center;

         .Home-actionbar-search {
            max-width: 24rem;
            --background-color: hsla(0, 0%, 100%, 0.9);
         }
         .Home-actionbar-search-isThin {
            margin-left: 1rem;
         }
         .Home-actionbar-search-isWide {
            margin-left: -0.7rem;
         }
      }
   }
</style>
