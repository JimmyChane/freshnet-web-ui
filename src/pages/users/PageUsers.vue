<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Loading from "@/components/Loading.vue";
   import MenuOption from "@/components/button/MenuOption.vue";
   import Selector from "@/components/selector/Selector.vue";
   import Empty from "@/components/Empty.vue";
   import WindowAction from "@/components/window/WindowAction.vue";
   import Input from "@/components/Input.vue";
   import ItemUser from "./ItemUser.vue";

   import User from "@/items/User.js";

   import HostIcon from "@/host/HostIcon";

   import PopupContext from "@/tools/PopupContext";
   import U from "@/U";

   export default {
      key: "users",
      title: "Other Users",
      icon: {
         light: new HostIcon("users-FFFFFF.svg"),
         dark: new HostIcon("users-000000.svg"),
      },
      userPermissions: ["admin"],

      components: {
         NavigationBar,
         Loading,
         MenuOption,
         Selector,
         Empty,
         WindowAction,
         Input,
         ItemUser,
      },
      data: (c) => ({
         scrollTop: 0,
         UserType: User.Type,

         window: {
            changeUserType: { isShowing: false, user: null, userType: "" },

            addUser: new PopupContext(c)
               .onShow((accept, reject, input) => {
                  accept();
                  c.window.addUser.username = "";
                  c.window.addUser.name = "";
                  c.window.addUser.passwordNew = "";
                  c.window.addUser.passwordRepeat = "";
               })
               .onDismiss((accept, reject) => {
                  accept();
                  c.window.addUser.username = "";
                  c.window.addUser.name = "";
                  c.window.addUser.passwordNew = "";
                  c.window.addUser.passwordRepeat = "";
               })
               .onCancel((accept, reject) => {
                  accept();
                  c.window.addUser.username = "";
                  c.window.addUser.name = "";
                  c.window.addUser.passwordNew = "";
                  c.window.addUser.passwordRepeat = "";
               })
               .onConfirm(async (accept, reject, output) => {
                  try {
                     const user = await c.userStore.dispatch("addUser", {
                        username: c.window.addUser.username,
                        name: c.window.addUser.name,
                        passwordNew: c.window.addUser.passwordNew,
                        passwordRepeat: c.window.addUser.passwordRepeat,
                     });

                     if (user) {
                        accept();
                        c.window.addUser.username = "";
                        c.window.addUser.name = "";
                        c.window.addUser.passwordNew = "";
                        c.window.addUser.passwordRepeat = "";
                        return;
                     }
                     c.store.dispatch("snackbarShow", "Failed to add user");
                     throw new Error();
                  } catch (error) {
                     c.store.dispatch("snackbarShow", "Error to add user");
                     reject();
                  }
               }),
            removeUser: new PopupContext(c).onConfirm(
               async (accept, reject, output) => {
                  try {
                     const result = await c.userStore.dispatch(
                        "removeUserByUsername",
                        { username: c.window.removeUser.input.username },
                     );

                     if (result) {
                        accept();
                        return;
                     }
                     c.store.dispatch("snackbarShow", "Failed to remove user");
                     throw new Error();
                  } catch (error) {
                     c.store.dispatch("snackbarShow", "Error to remove user");
                     reject();
                  }
               },
            ),
            changeUserType: new PopupContext(c)
               .onShow((accept, reject, input) => {
                  accept();
                  c.window.changeUserType.user = input;
                  c.window.changeUserType.userType = input.userType;
               })
               .onDismiss((accept, reject) => {
                  accept();
                  c.window.changeUserType.user = null;
                  c.window.changeUserType.userType = "";
               })
               .onCancel((accept, reject) => {
                  accept();
                  c.window.changeUserType.user = null;
                  c.window.changeUserType.userType = "";
               })
               .onConfirm(async (accept, reject, output) => {
                  try {
                     const userTypeNumber = U.optNumber(
                        Number.parseInt(c.window.changeUserType.userType),
                        0,
                     );

                     const userChange = await c.userStore.dispatch(
                        "updateTypeOfUserByUsername",
                        {
                           username: c.window.changeUserType.user.username,
                           userType: userTypeNumber,
                        },
                     );
                     if (userChange) {
                        accept();
                        c.window.changeUserType.user = null;
                        c.window.changeUserType.userType = "";
                        return;
                     }
                     c.store.dispatch(
                        "snackbarShow",
                        "Failed to change user priviledge",
                     );
                     throw new Error();
                  } catch (error) {
                     c.store.dispatch(
                        "snackbarShow",
                        "Error to change user priviledge",
                     );
                     reject();
                  }
               }),
         },
      }),
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
      created() {
         this.window.changeUserType.userType = "";
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
      },
   };
</script>

<template>
   <div
      class="PageUsers"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <NavigationBar
         :title="$options.title"
         :rightMenus="[
            isCurrentUserAdmin
               ? {
                    key: 'addUser',
                    title: 'Add User',
                    icon: host.icon('add-000000'),
                    click: () => window.addUser.show(),
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
            @click-changeUserType="(item) => window.changeUserType.show(item)"
            @click-remove="(item) => window.removeUser.show(item)"
         />
      </div>

      <Empty
         v-if="!users.length && !isLoading"
         :icon="$options.icon.dark.toUrl()"
      />

      <Loading class="PageUsers-loading" :isShowing="isLoading" />

      <!-- add user -->
      <WindowAction
         title="Add User"
         :isShowing="window.addUser.isShowing"
         @click-dismiss="() => window.addUser.dismiss()"
         @click-cancel="() => window.addUser.cancel()"
         @click-ok="() => window.addUser.confirm()"
      >
         <div class="PageUsers-window">
            <Input
               label="Username"
               :isRequired="true"
               :bindValue="window.addUser.username"
               @input="(comp) => (window.addUser.username = comp.value)"
            />
            <Input
               label="Name"
               autocapitalize="words"
               :isRequired="true"
               :bindValue="window.addUser.name"
               @input="(comp) => (window.addUser.name = comp.value)"
            />
            <Input
               label="Password"
               type="password"
               :isRequired="true"
               :bindValue="window.addUser.passwordNew"
               @input="(comp) => (window.addUser.passwordNew = comp.value)"
            />
            <Input
               label="Repeat Password"
               type="password"
               :isRequired="true"
               :bindValue="window.addUser.passwordRepeat"
               @input="(comp) => (window.addUser.passwordRepeat = comp.value)"
            />
         </div>
      </WindowAction>

      <!-- remove user -->
      <WindowAction
         title="Remove User?"
         :isShowing="window.removeUser.isShowing"
         @click-dismiss="() => window.removeUser.dismiss()"
         @click-cancel="() => window.removeUser.cancel()"
         @click-ok="() => window.removeUser.confirm()"
      >
         <div class="PageUsers-window">
            <div class="PageUsers-window-main">
               <p class="PageUsers-window-text"
                  >Once removed, cannot be undone</p
               >
            </div>
         </div>
      </WindowAction>

      <!-- change user -->
      <WindowAction
         title="Change User Type"
         :isShowing="window.changeUserType.isShowing"
         @click-dismiss="() => window.changeUserType.dismiss()"
         @click-cancel="() => window.changeUserType.cancel()"
         @click-ok="() => window.changeUserType.confirm()"
      >
         <div class="PageUsers-window">
            <div class="PageUsers-window-main">
               <span class="PageUsers-window-text">
                  {{
                     window.changeUserType.user
                        ? window.changeUserType.user.name
                        : "Unknown"
                  }}
                  is
                  {{
                     window.changeUserType.user
                        ? window.changeUserType.user.toTextUserType()
                        : ""
                  }}</span
               >
            </div>

            <div class="PageUsers-window-main">
               <span class="PageUsers-window-title">New User Type</span>
               <span class="PageUsers-window-required">Required</span>
               <Selector
                  :list="[
                     { key: UserType.Admin.toString(), title: 'Admin' },
                     { key: UserType.Staff.toString(), title: 'Staff' },
                  ]"
                  :keySelected="window.changeUserType.userType.toString()"
                  @callback-select="
                     (key) => (window.changeUserType.userType = key)
                  "
               />
            </div>
         </div>
      </WindowAction>
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

      .PageUsers-window {
         width: 20rem;
         max-width: 100%;
         display: flex;
         flex-direction: column;
         gap: 2rem;

         .PageUsers-window-main {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .PageUsers-window-title {
               font-size: 1.1rem;
               font-weight: 600;
            }
            .PageUsers-window-inputText {
               flex-grow: 1;
               font-size: 1rem;
               border: none;
               border-bottom: 1px solid hsl(0, 0%, 70%);
               background: none;
               padding: 4px 0;
            }
            .PageUsers-window-text {
               flex-grow: 1;
               font-size: 1rem;
               padding: 4px 0;
            }
            .PageUsers-window-required {
               color: hsl(0, 50%, 50%);
               font-size: 0.8rem;
            }
         }
      }
   }
</style>
