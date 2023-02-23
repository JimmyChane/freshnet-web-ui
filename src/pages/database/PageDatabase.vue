<script>
   import Loading from "@/components/Loading.vue";
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Empty from "@/components/Empty.vue";
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import ItemDatabase from "./ItemDatabase.vue";

   import HostIcon from "@/host/HostIcon";

   export default {
      key: "database",
      title: "Database",
      icon: {
         light: new HostIcon("database-FFFFFF.svg"),
         dark: new HostIcon("database-000000.svg"),
      },
      userPermissions: ["admin"],

      components: { Loading, PopupWindow, Empty, NavigationBar, ItemDatabase },
      emits: ["callback-side-expand"],
      data() {
         return {
            scrollTop: 0,
            imports: { data: null },
            addDatabase: { isShowing: false },
         };
      },
      computed: {
         isLoading: (c) => {
            const { loginStore, databaseStore } = c;
            return (
               loginStore.getters.isLoading || databaseStore.getters.isLoading
            );
         },
         user: (c) => c.loginStore.getters.user,
         baseInfo: (c) => c.databaseStore.getters.baseInfo,
         databases: (c) => c.databaseStore.getters.items,
      },
      mounted() {
         this.loginStore
            .dispatch("refresh")
            .then(() => {
               this.actionRefresh();
            })
            .catch((error) => {
               this.store.dispatch("snackbarShow","Your login credential could be invalid");
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

               this.databaseStore.dispatch("imports", { json: reader.result });
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
                  return this.databaseStore.dispatch("loadBaseInfo");
               })
               .catch((error) => {
                  this.store.dispatch("snackbarShow","Error Loading Databases");
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
               icon: host.icon('refresh-000000'),
               click: () => actionRefresh(),
            },
         ]"
      />

      <div
         class="PageDatabase-body"
         v-if="user && baseInfo && databases.length"
      >
         <div class="PageDatabase-import">
            <span class="PageDatabase-title">Import</span>
            <input
               type="file"
               accept=".json"
               @change="
                  (event) => {
                     const [file] = event.target.files;
                     importDataFile(file);
                  }
               "
            />
            <p v-if="imports.data">{{ imports.data }}</p>
         </div>

         <div class="PageDatabase-baseInfo">
            <span class="PageDatabase-title">Current Database</span>
            <span v-if="baseInfo">{{ baseInfo.currentDatabase }}</span>
         </div>

         <div class="PageDatabase-databases">
            <span class="PageDatabase-title">Databases</span>
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

      <PopupWindow
         class="PageDatabase-window"
         :isShowing="addDatabase.isShowing"
         @click-dismiss="addDatabase.isShowing = false"
      >
         <div>
            <span>Create Database</span>

            <label>Database Name</label>
            <input type="text" placeholder="Database Name" />
         </div>
      </PopupWindow>

      <Loading class="PageDatabase-loading" :isShowing="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   //Abstract
   .PageDatabase-title {
      font-weight: 600;
      font-size: 1.4rem;
      color: hsla(0, 0%, 0%, 0.8);
      letter-spacing: 0.1rem;
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
         .PageDatabase-import {
            display: none;
         }
         .PageDatabase-baseInfo {
            font-size: 1.2rem;
         }
      }

      .PageDatabase-window {
         z-index: 3;
         display: none;
      }

      .PageDatabase-loading {
         position: absolute;
         z-index: 1;
         width: 100%;
      }
   }
</style>
