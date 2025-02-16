<script>
import { cloudinaryServer } from '@/host/Server';
import { useAppStore } from '@/stores/app.store';
import { NAVIGATION_MIN_WIDTH, NavigationLayout } from '@/tools/Navigation';

export default {
  props: { isWide: { type: Boolean, default: false } },
  data: () => {
    return { cloudinaryServer };
  },
  computed: {
    isDrawer: (c) => useAppStore().navigation.isDrawer(),
    isExpanded: (c) => useAppStore().navigation.isExpanded(),
    toggleButtonVisible: (c) =>
      !useAppStore().navigation.isThin() ||
      useAppStore().window.innerWidth > NAVIGATION_MIN_WIDTH,
  },
  methods: {
    toggleCollapse() {
      if (this.isDrawer) {
        this.isExpanded
          ? useAppStore().navigation.closeNavigationDrawer()
          : useAppStore().navigation.openNavigationDrawer();
        return;
      }

      const nextLayout = this.isWide
        ? NavigationLayout.THIN
        : NavigationLayout.WIDE;

      useAppStore().navigation.getCurrentLayoutRequest() === null
        ? useAppStore().navigation.setDefaultLayout(nextLayout)
        : useAppStore().navigation.setLayout(nextLayout);
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
          cloudinaryServer({ url: 'logo/svg/freshnet-enterprise-logo.svg' })
        "
      />
      <span class="LeftNavHeader-title">Freshnet Enterprise</span>
    </router-link>

    <button
      class="LeftNavHeader-collapse"
      v-if="toggleButtonVisible"
      @click="() => toggleCollapse()"
    >
      <img class="transition" src="@/assets/icon/arrowDown-000000.svg" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.LeftNavHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  padding-right: 0;

  position: sticky;
  top: 0;

  background: inherit;

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

.LeftNavHeader[isWide='true'] {
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
.LeftNavHeader[isWide='false'] {
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
