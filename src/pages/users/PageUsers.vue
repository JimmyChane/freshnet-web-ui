<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Loading from "@/components/Loading.vue";
   import MenuOption from "@/components/button/MenuOption.vue";
   import Selector from "@/components/selector/Selector.vue";
   import Empty from "@/components/Empty.vue";
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import Input from "@/components/Input.vue";
   import ItemUser from "./ItemUser.vue";

   import User from "@/items/User.js";

   import HostIcon from "@/host/HostIcon";

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
         PopupWindowAction,
         Input,
         ItemUser,
      },
      emits: ["callback-side-expand"],
      data() {
         return {
            scrollTop: 0,
            UserType: User.Type,

            window: {
               addUser: {
                  isShowing: false,
                  username: "",
                  name: "",
                  passwordNew: "",
                  passwordRepeat: "",
               },
               removeUser: { isShowing: false, user: null },
               changeUserType: { isShowing: false, user: null, userType: "" },
            },
         };
      },
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
               this.store.dispatch("snackbarShow","Failed to validate user");
            });
         },

         onIntentAddUser() {
            this.onResetAddUser();
            this.window.addUser.isShowing = true;
         },
         onDismissAddUser() {
            this.window.addUser.isShowing = false;
            this.onResetAddUser();
         },
         onFinishAddUser() {
            this.userStore
               .dispatch("addUser", {
                  username: this.window.addUser.username,
                  name: this.window.addUser.name,
                  passwordNew: this.window.addUser.passwordNew,
                  passwordRepeat: this.window.addUser.passwordRepeat,
               })
               .then((user) => {
                  if (user) {
                     this.window.addUser.isShowing = false;
                     this.onResetAddUser();
                  } else {
                     this.store.dispatch("snackbarShow","Failed to add user");
                     throw new Error();
                  }
               })
               .catch((error) => {
                  this.store.dispatch("snackbarShow","Error to add user");
               });
         },
         onResetAddUser() {
            this.window.addUser.username = "";
            this.window.addUser.name = "";
            this.window.addUser.passwordNew = "";
            this.window.addUser.passwordRepeat = "";
         },

         onIntentRemoveUser(user) {
            this.onResetRemoveUser();
            this.window.removeUser.user = user;
            this.window.removeUser.isShowing = true;
         },
         onDismissRemoveUser() {
            this.window.removeUser.isShowing = false;
            this.onResetRemoveUser();
         },
         onFinishRemoveUser() {
            const interfaceWindow = this.window.removeUser;
            this.userStore
               .dispatch("removeUserByUsername", {
                  username: interfaceWindow.user.username,
               })
               .then((result) => {
                  if (result) {
                     interfaceWindow.isShowing = false;
                     this.onResetRemoveUser();
                  } else {
                     this.store.dispatch("snackbarShow","Failed to remove user");
                     throw new Error();
                  }
               })
               .catch((error) => {
                  this.store.dispatch("snackbarShow","Error to remove user");
               });
         },
         onResetRemoveUser() {
            this.window.removeUser.user = null;
         },

         onIntentChangeUserType(user) {
            this.onResetChangeUserType();
            this.window.changeUserType.isShowing = true;
            this.window.changeUserType.user = user;
            this.window.changeUserType.userType = user.userType;
         },
         onDismissChangeUserType() {
            this.window.changeUserType.isShowing = false;
            this.onResetChangeUserType();
         },
         onFinishChangeUserType() {
            let userTypeNumber = Number.parseInt(
               this.window.changeUserType.userType,
            );
            if (Number.isNaN(userTypeNumber)) userTypeNumber = 0;

            return this.userStore
               .dispatch("updateTypeOfUserByUsername", {
                  username: this.window.changeUserType.user.username,
                  userType: userTypeNumber,
               })
               .then((userChange) => {
                  if (userChange) {
                     this.window.changeUserType.isShowing = false;
                     this.onResetChangeUserType();
                  } else {
                     this.store.dispatch("snackbarShow","Failed to change user priviledge");
                     throw new Error();
                  }
               })
               .catch((error) => {
                  this.store.dispatch("snackbarShow","Error to change user priviledge");
               });
         },
         onResetChangeUserType() {
            this.window.changeUserType.user = null;
            this.window.changeUserType.userType = "";
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
                    click: onIntentAddUser,
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
            @click-changeUserType="(item) => onIntentChangeUserType(item)"
            @click-remove="(item) => onIntentRemoveUser(item)"
         />
      </div>

      <Empty
         v-if="!users.length && !isLoading"
         :icon="$options.icon.dark.toUrl()"
      />

      <Loading class="PageUsers-loading" :isShowing="isLoading" />

      <!-- add user -->
      <PopupWindowAction
         title="Add User"
         :isShowing="window.addUser.isShowing"
         @click-dismiss="onDismissAddUser"
         @click-cancel="onDismissAddUser"
         @click-ok="onFinishAddUser"
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
      </PopupWindowAction>

      <!-- remove user -->
      <PopupWindowAction
         title="Remove User?"
         :isShowing="window.removeUser.isShowing"
         @click-dismiss="onDismissRemoveUser"
         @click-cancel="onDismissRemoveUser"
         @click-ok="onFinishRemoveUser"
      >
         <div class="PageUsers-window">
            <div class="PageUsers-window-main">
               <p class="PageUsers-window-text"
                  >Once removed, cannot be undone</p
               >
            </div>
         </div>
      </PopupWindowAction>

      <!-- change user -->
      <PopupWindowAction
         title="Change User Type"
         :isShowing="window.changeUserType.isShowing"
         @click-dismiss="onDismissChangeUserType"
         @click-cancel="onDismissChangeUserType"
         @click-ok="onFinishChangeUserType"
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
      </PopupWindowAction>
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
