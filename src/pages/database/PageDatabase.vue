<script>
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import Empty from '@/components/Empty.vue';
import Loading from '@/components/Loading.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import { onCreatedRoute } from '@/mixin';
import { DATABASE_ROUTE } from '@/router';
import { useAppStore } from '@/stores/app.store';
import { useDatabaseStore } from '@/stores/database.store';
import { useLoginStore } from '@/stores/login.store';

import ItemDatabase from './ItemDatabase.vue';

export default {
  components: { Loading, Empty, NavigationBar, ItemDatabase },
  data: (c) => ({
    DATABASE_ROUTE,
    IconRefresh,
    scrollTop: 0,
    imports: { data: null },
    addDatabase: { isShowing: false },
  }),
  computed: {
    isLoading: (c) => {
      return useLoginStore().isLoading || useDatabaseStore().isLoading;
    },
    user: (c) => useLoginStore().user,
    baseInfo: (c) => useDatabaseStore().baseInfo,
    databases: (c) => useDatabaseStore().items,
  },
  created() {
    onCreatedRoute(DATABASE_ROUTE);
  },
  mounted() {
    useLoginStore()
      .refresh()
      .then(() => {
        this.actionRefresh();
      })
      .catch((error) => {
        useAppStore().snackbarShow('Your login credential could be invalid');
        throw error;
      });
  },
  watch: {
    user() {
      this.actionRefresh();
    },
  },
  methods: {
    importDataFile(file) {
      if (!file) {
        this.imports.data = null;
        return;
      }
      let reader = new FileReader();
      reader.onload = (event) => {
        this.imports.data = reader.result;

        useDatabaseStore().imports({ json: reader.result });
      };
      reader.readAsText(file);
    },

    actionAddDatabase() {
      this.addDatabase.isShowing = true;
    },

    actionRefresh() {
      return Promise.resolve()
        .then(() => {
          if (this.user === null || !this.user.isTypeAdmin()) {
            throw new Error();
          }
          return useDatabaseStore().loadBaseInfo();
        })
        .catch((error) => {
          useAppStore().snackbarShow('Error Loading Databases');
          throw error;
        });
    },
  },
};
</script>

<template>
  <div
    class="PageDatabase"
    @scroll="(event) => (scrollTop = event.target.scrollTop)"
  >
    <NavigationBar
      style="z-index: 2"
      :title="DATABASE_ROUTE.title"
      :rightMenus="[
        {
          key: 'refresh',
          title: 'Refresh',
          icon: IconRefresh,
          click: () => actionRefresh(),
        },
      ]"
    />

    <div class="PageDatabase-body" v-if="user && baseInfo && databases.length">
      <div class="PageDatabase-baseInfo">
        <span class="PageDatabase-title">Database Using Now</span>
        <span v-if="baseInfo">{{ baseInfo.currentDatabase }}</span>
      </div>

      <div>
        <span class="PageDatabase-title">Database</span>
        <ItemDatabase
          class="PageDatabase-database"
          v-for="database in databases"
          :key="database.name"
          :database="database"
        />
      </div>
    </div>

    <Empty
      v-if="!baseInfo && !databases.length && !isLoading"
      :icon="DATABASE_ROUTE.icon.dark.toUrl()"
    />

    <Loading class="PageDatabase-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
//Abstract
.PageDatabase-title {
  font-weight: 600;
  font-size: 1.4rem;
  color: black;
}

.PageDatabase {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .PageDatabase-body {
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem;
    padding-bottom: 10rem;
    gap: 5rem;
    position: relative;

    & > * {
      width: 100%;
      max-width: 35rem;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .PageDatabase-baseInfo {
      font-size: 1rem;
    }
  }

  .PageDatabase-window {
    z-index: 3;
  }

  .PageDatabase-loading {
    position: absolute;
    z-index: 1;
    width: 100%;
  }
}
</style>
