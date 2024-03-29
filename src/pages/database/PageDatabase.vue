<script>
  import Loading from "@/components/Loading.vue";
  import Empty from "@/components/Empty.vue";
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import ItemDatabase from "./ItemDatabase.vue";
  import Server from "@/host/Server";
  import IconPack from "@/app/IconPack";

  import IconRefresh from "@/assets/icon/refresh-000000.svg";

  export default {
    key: "database",
    title: "Database",
    icon: new IconPack(
      Server.resource.icon("database-FFFFFF"),
      Server.resource.icon("database-000000"),
    ),
    userPermissions: ["admin"],

    components: { Loading, Empty, NavigationBar, ItemDatabase },
    data: (c) => ({
      IconRefresh,
      scrollTop: 0,
      imports: { data: null },
      addDatabase: { isShowing: false },
    }),
    computed: {
      isLoading: (c) => {
        const loginStore = c.$store.state.stores.login;
        const databaseStore = c.$store.state.stores.database;
        return loginStore.getters.isLoading || databaseStore.getters.isLoading;
      },
      user: (c) => c.$store.state.stores.login.getters.user,
      baseInfo: (c) => c.$store.state.stores.database.getters.baseInfo,
      databases: (c) => c.$store.state.stores.database.getters.items,
    },
    mounted() {
      this.$store.state.stores.login
        .dispatch("refresh")
        .then(() => {
          this.actionRefresh();
        })
        .catch((error) => {
          this.$store.dispatch(
            "snackbarShow",
            "Your login credential could be invalid",
          );
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

          this.$store.state.stores.database.dispatch("imports", {
            json: reader.result,
          });
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
            return this.$store.state.stores.database.dispatch("loadBaseInfo");
          })
          .catch((error) => {
            this.$store.dispatch("snackbarShow", "Error Loading Databases");
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
      :title="$options.title"
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
      :icon="$options.icon.dark.toUrl()"
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
