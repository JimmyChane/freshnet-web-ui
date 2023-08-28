<script>
  import Actionbar from "./Actionbar.vue";

  export default {
    components: { Actionbar },
    props: {
      title: { type: String, default: "" },
      leftMenus: { type: Array, default: () => [] },
      rightMenus: { type: Array, default: () => [] },
      iconTheme: { type: String, default: "black" },
    },
    computed: {
      moreLeftMenus: (c) => {
        if (!c.$store.getters.navigation.isDrawer()) return c.leftMenus;

        const hamburgerMenuIcon =
          c.iconTheme === "white"
            ? c.host.icon("hamburgerMenu-FFFFFF")
            : c.host.icon("hamburgerMenu-000000");
        return [
          {
            key: "hamburgerMenu",
            title: "Hamburger Menu",
            icon: hamburgerMenuIcon.toUrl(),
            click: () => c.$store.getters.navigation.openNavigationDrawer(),
          },
          ...c.leftMenus,
        ];
      },
    },
  };
</script>

<template>
  <Actionbar :title="title" :leftMenus="moreLeftMenus" :rightMenus="rightMenus">
    <slot />
  </Actionbar>
</template>
