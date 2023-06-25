<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Loading from "@/components/Loading.vue";
   import Empty from "@/components/Empty.vue";
   import ItemUser from "./ItemUser.vue";

   import HostIcon from "@/host/HostIcon";

   import U from "@/U";

   import WindowAdd from "./WindowAdd.vue";
   import WindowRemove from "./WindowRemove.vue";
   import WindowChange from "./WindowChange.vue";

   export default {
      key: "users",
      title: "Other Users",
      icon: {
         light: new HostIcon("users-FFFFFF.svg"),
         dark: new HostIcon("users-000000.svg"),
      },
      userPermissions: ["admin"],

      components: { NavigationBar, Loading, Empty, ItemUser },
      computed: {
         isLoading: (c) => c.userStore.getters.isLoading,
         isCurrentUserAdmin: (c) => (c.user ? c.user.isTypeAdmin() : false),

         user: (c) => c.loginStore.getters.user,
         users: (c) => {
            return (!c.user.isTypeNone() ? c.userStore.getters.items : []).sort(
               (user1, user2) => {
                  if (user1.username === c.user.username) return -1;
                  if (user2.username === c.user.username) return 1;
                  return 0;
               },
            );
         },
      },
      mounted() {
         this.onIntentRefresh();
      },
      methods: {
         isCurrentUser(user) {
            if (!this.user) return false;
            return user.username === this.user.username;
         },

         onIntentRefresh() {
            this.userStore.dispatch("refresh").catch((error) => {
               this.store.dispatch("snackbarShow", "Failed to validate user");
            });
         },

         async openWindowAdd() {
            const popupWindow = await this.store.dispatch("openPopupWindow", {
               component: WindowAdd,
               onConfirm: async (data) => {
                  try {
                     const user = await this.userStore.dispatch("addUser", {
                        username: data.username,
                        name: data.name,
                        passwordNew: data.passwordNew,
                        passwordRepeat: data.passwordRepeat,
                     });

                     if (user) {
                        popupWindow.close();
                        return;
                     }
                     this.store.dispatch("snackbarShow", "Failed to add user");
                     throw new Error();
                  } catch (error) {
                     this.store.dispatch("snackbarShow", "Error to add user");
                  }
               },
            });
         },
         async openWindowRemove(user) {
            const popupWindow = await this.store.dispatch("openPopupWindow", {
               component: WindowRemove,
               onConfirm: async () => {
                  try {
                     const result = await this.userStore.dispatch(
                        "removeUserByUsername",
                        { username: user.username },
                     );

                     if (result) {
                        popupWindow.close();
                        return;
                     }
                     this.store.dispatch(
                        "snackbarShow",
                        "Failed to remove user",
                     );
                     throw new Error();
                  } catch (error) {
                     this.store.dispatch(
                        "snackbarShow",
                        "Error to remove user",
                     );
                  }
               },
            });
         },
         async openWindowChange(user) {
            const popupWindow = await this.store.dispatch("openPopupWindow", {
               component: WindowChange,
               user,
               userType: user.userType,
               onConfirm: async (data) => {
                  try {
                     const userTypeNumber = U.optNumber(
                        Number.parseInt(data.userType),
                        0,
                     );

                     const userChange = await this.userStore.dispatch(
                        "updateTypeOfUserByUsername",
                        {
                           username: data.user.username,
                           userType: userTypeNumber,
                        },
                     );
                     if (userChange) {
                        popupWindow.close();
                        return;
                     }
                     this.store.dispatch(
                        "snackbarShow",
                        "Failed to change user priviledge",
                     );
                     throw new Error();
                  } catch (error) {
                     this.store.dispatch(
                        "snackbarShow",
                        "Error to change user priviledge",
                     );
                  }
               },
            });
         },
      },
   };
</script>

<template>
   <div class="PageUsers">
      <NavigationBar
         :title="$options.title"
         :rightMenus="[
            isCurrentUserAdmin
               ? {
                    key: 'addUser',
                    title: 'Add User',
                    icon: host.icon('add-000000'),
                    click: () => openWindowAdd(),
                 }
               : null,
            {
               key: 'refresh',
               title: 'Refresh',
               icon: host.icon('refresh-000000'),
               click: () => onIntentRefresh(),
            },
         ]"
      />

      <div class="PageUsers-body" v-if="users.length">
         <ItemUser
            v-for="user in users"
            :key="user.username"
            :item="user"
            :isEditable="isCurrentUserAdmin && !isCurrentUser(user)"
            :isCurrentUser="isCurrentUser(user)"
            @click-changeUserType="(user) => openWindowChange(user)"
            @click-remove="(user) => openWindowRemove(user)"
         />
      </div>

      <Empty
         v-if="!users.length && !isLoading"
         :icon="$options.icon.dark.toUrl()"
      />

      <Loading class="PageUsers-loading" :isShowing="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   .PageUsers {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;

      .PageUsers-body {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;
         padding: 4rem;
         gap: 0.2rem;

         & > * {
            width: 100%;
            max-width: 24rem;
         }
      }

      .PageUsers-loading {
         position: absolute;
         width: 100%;
         z-index: 100;
      }

      .PageUsers-user-root {
         width: 100%;
         max-width: 24rem;
         display: flex;
         flex-direction: column;
         align-items: stretch;
         &-separator {
            min-height: 1px;
            background: hsla(0, 0%, 0%, 0.1);
            margin: 1rem 0;
         }
      }
   }
</style>
