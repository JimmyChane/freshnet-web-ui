<script>
  import Navigation from "@/tools/Navigation";

  export default {
    props: { isWide: { type: Boolean, default: false } },
    computed: {
      isDrawer: (c) => c.store.getters.navigation.isDrawer(),
      isExpanded: (c) => c.store.getters.navigation.isExpanded(),
      toggleButtonVisible: (c) =>
        !c.store.getters.navigation.isThin() ||
        c.store.getters.window.innerWidth > Navigation.MIN_WIDTH,
    },
    methods: {
      toggleCollapse() {
        if (this.isDrawer) {
          this.isExpanded
            ? this.store.getters.navigation.closeNavigationDrawer()
            : this.store.getters.navigation.openNavigationDrawer();
          return;
        }

        const nextLayout = this.isWide
          ? Navigation.Layout.THIN
          : Navigation.Layout.WIDE;

        this.store.getters.navigation.getCurrentLayoutRequest() === null
          ? this.store.getters.navigation.setDefaultLayout(nextLayout)
          : this.store.getters.navigation.setLayout(nextLayout);
      },
    },
  };
</script>

<template>
  <div class="LeftNavHeader" :isWide="`${isWide}`">
    <router-link class="LeftNavHeader-logo transition" :to="{ path: '/' }">
      <img
        class="LeftNavHeader-icon transition"
        :src="
          host.cloudinary({
            url: 'logo/svg/freshnet-enterprise-logo.svg',
          })
        "
      />
      <span class="LeftNavHeader-title">Freshnet Enterprise</span>
    </router-link>

    <button
      class="LeftNavHeader-collapse"
      v-if="toggleButtonVisible"
      @click="() => toggleCollapse()"
    >
      <img class="transition" :src="host.icon('arrowDown-000000').toUrl()" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .LeftNavHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem;

    position: sticky;
    top: 0;

    background: hsl(0, 0%, 90%);

    .LeftNavHeader-logo {
      gap: 0.5rem;
      padding: 1rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      text-decoration: none;
      color: var(--primary-color);
      background: none;

      &:hover {
        text-decoration: underline;
      }

      .LeftNavHeader-title {
        font-weight: 600;
        line-height: 1;
        color: black;
      }
    }
    .LeftNavHeader-collapse {
      background: none;
      border: none;
      border-radius: 50%;
      padding: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        padding: 0.5rem;
        width: 2rem;
        height: 2rem;
        transform: rotate(90deg);
      }
    }
  }

  .LeftNavHeader[isWide="true"] {
    flex-direction: row;
    .LeftNavHeader-logo {
      .LeftNavHeader-icon {
        width: 1.8rem;
        height: 1.8rem;
      }
    }
    .LeftNavHeader-collapse {
      img {
        transform: rotate(90deg);
      }
      &:hover {
        img {
          transform: scale(0.9) rotate(90deg);
        }
      }
    }
  }
  .LeftNavHeader[isWide="false"] {
    flex-direction: column-reverse;
    gap: 0.5rem;
    .LeftNavHeader-logo {
      .LeftNavHeader-icon {
        width: 1.3rem;
        height: 1.3rem;
      }
      .LeftNavHeader-title {
        display: none;
      }
    }
    .LeftNavHeader-collapse {
      img {
        transform: rotate(-90deg);
      }
      &:hover {
        img {
          transform: scale(0.9) rotate(-90deg);
        }
      }
    }
  }
</style>
