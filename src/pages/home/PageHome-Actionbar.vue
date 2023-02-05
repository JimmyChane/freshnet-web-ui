<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import GlobalSearch from "@/app/GlobalSearch.vue";

   export default {
      components: { Actionbar, GlobalSearch },
      props: {
         isTop: { type: Boolean, default: false },
         isThin: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <Actionbar
      class="HomeActionbar"
      :leftMenus="[
         $root.navigation.isDrawer()
            ? {
                 title: 'Hamburger Menu',
                 icon: host.res('icon/hamburgerMenu-000000.svg'),
                 click: () => $root.navigation.openNavigationDrawer(),
              }
            : null,
         isThin
            ? {
                 icon: host.res('img/freshnet-enterprise-logo.svg'),
                 click: () => {},
              }
            : null,
      ]"
   >
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
   </Actionbar>
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
