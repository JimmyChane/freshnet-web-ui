<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Loading from "@/components/Loading.vue";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import PopupWindowAction from "@/components/window/PopupWindowAction.vue";
   import Input from "@/components/Input.vue";

   import HostIcon from "@/host/HostIcon";

   export default {
      key: "profile",
      title: "Your Profile",
      icon: {
         light: new HostIcon("profile-FFFFFF.svg"),
         dark: new HostIcon("profile-000000.svg"),
      },

      components: {
         NavigationBar,
         Loading,
         ButtonIcon,
         PopupWindowAction,
         Input,
      },
      data: (c) => ({
         user: null,
         isLoading: false,
         scrollTop: 0,

         window: {
            changePassword: {
               isShowing: false,
               passwordVerify: "",
               passwordNew: "",
               passwordRepeat: "",
            },
         },
      }),
      computed: {
         name: (c) => c.user.name,
         username: (c) => c.user.username,
         typeDisplay() {
            if (this.user.isTypeAdmin()) return "Admin";
            if (this.user.isTypeStaff()) return "Staff";
            if (this.user.isTypeCustomer()) return "Customer";
            return "Other";
         },
      },
      methods: {
         onDiscardChangePassword() {
            this.window.changePassword.isShowing = false;
            this.window.changePassword.passwordVerify = "";
            this.window.changePassword.passwordNew = "";
            this.window.changePassword.passwordRepeat = "";
         },
         onCommitChangePassword() {
            const { passwordVerify, passwordNew, passwordRepeat } =
               this.window.changePassword;

            if (passwordNew !== passwordRepeat) {
               this.store.dispatch(
                  "snackbarShow",
                  "Repeat Password Not Match With New Password",
               );
               return;
            }

            this.loginStore
               .dispatch("changePassword", { passwordVerify, passwordNew })
               .then((user) => this.onDiscardChangePassword())
               .catch((error) =>
                  this.store.dispatch(
                     "snackbarShow",
                     "Changing Password Error",
                  ),
               );
         },
      },
      async mounted() {
         this.isLoading = true;
         await this.loginStore
            .dispatch("getUser")
            .then((user) => {
               this.isLoading = false;
               this.user = user;
            })
            .catch((error) => {
               this.store.dispatch("snackbarShow", "Failed to validate");
               this.isLoading = false;
               this.user = null;
            });
      },
   };
</script>

<template>
   <div class="PageProfile">
      <div
         class="PageProfile-scroll"
         @scroll="(event) => (scrollTop = event.target.scrollTop)"
      >
         <NavigationBar style="z-index: 2" :title="$options.title" />

         <div class="PageProfile-body" v-if="user">
            <div class="PageProfile-section PageProfile-introduction">
               <div class="PageProfile-introduction-body">
                  <span class="PageProfile-user-name">Hello, {{ name }}</span>
                  <div class="PageProfile-user-main">
                     <span class="PageProfile-section-title">{{
                        `@${username}`
                     }}</span>
                     <span class="PageProfile-section-title">{{
                        typeDisplay
                     }}</span>
                  </div>
               </div>
            </div>

            <div class="PageProfile-section">
               <span class="PageProfile-section-title">Sessions</span>
               <span class="PageProfile-section-main">Built in progress</span>
            </div>

            <div class="PageProfile-section">
               <div class="PageProfile-section-changePassword">
                  <div class="PageProfile-section-changePassword-body">
                     <span class="PageProfile-section-title"
                        >Change Your Password</span
                     >
                     <span class="PageProfile-section-main"
                        >Also signing out other session</span
                     >
                  </div>
                  <ButtonIcon
                     class="PageProfile-section-changePassword-arrow"
                     :src="host.icon('arrowDown-000000')"
                     @click="window.changePassword.isShowing = true"
                  />
               </div>
            </div>
         </div>
      </div>

      <PopupWindowAction
         title="Change Your Password"
         :isShowing="window.changePassword.isShowing"
         @click-dismiss="onDiscardChangePassword"
         @click-cancel="onDiscardChangePassword"
         @click-ok="onCommitChangePassword"
      >
         <div class="PageProfile-window-changePassword">
            <Input
               class="PageProfile-window-changePassword-first"
               type="password"
               label="Current Password"
               :bindValue="window.changePassword.passwordVerify"
               :isRequired="true"
               @input="
                  (comp) => (window.changePassword.passwordVerify = comp.value)
               "
            />

            <Input
               type="password"
               label="New Password"
               :bindValue="window.changePassword.passwordNew"
               :isRequired="true"
               @input="
                  (comp) => (window.changePassword.passwordNew = comp.value)
               "
            />

            <Input
               type="password"
               label="Repeat Password"
               :bindValue="window.changePassword.passwordRepeat"
               :isRequired="true"
               @input="
                  (comp) => (window.changePassword.passwordRepeat = comp.value)
               "
            />
         </div>
      </PopupWindowAction>

      <Loading class="PageProfile-loading" :isShowing="isLoading" />
   </div>
</template>

<style lang="scss" scoped>
   .PageProfile {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .PageProfile-scroll {
         position: relative;
         overflow: auto;
         height: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-start;

         .PageProfile-body {
            z-index: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3rem 6rem;
            padding: 4rem;

            .PageProfile-loading {
               position: absolute;
               width: 100%;
               z-index: 1;
            }

            // Abstract
            .PageProfile-section {
               width: 100%;
               max-width: 35rem;
               display: flex;
               flex-direction: column;
               // Abstract
               .PageProfile-section-title {
                  font-size: 1rem;
               }
               // Abstract
               .PageProfile-section-main {
                  font-size: 0.8rem;
                  color: hsl(0, 0%, 30%);
               }
            }

            .PageProfile-introduction {
               .PageProfile-introduction-body {
                  width: 20em;
                  max-width: 100%;
                  background-color: hsla(0, 0%, 0%, 0.8);
                  color: white;
                  display: flex;
                  flex-direction: column;
                  gap: 1em;
                  padding: 2em;
                  border-radius: 1em;
                  .PageProfile-user-name {
                     font-size: 2em;
                  }
                  .PageProfile-user-main {
                     display: flex;
                     flex-direction: row;
                     column-gap: 4rem;

                     & > * {
                        display: flex;
                        flex-direction: column;
                     }
                  }
               }
            }

            .PageProfile-section-changePassword {
               width: max-content;
               display: flex;
               flex-direction: row;
               align-items: center;
               gap: 2rem;

               .PageProfile-section-changePassword-body {
                  flex-grow: 1;
                  display: flex;
                  flex-direction: column;
               }
               .PageProfile-section-changePassword-arrow {
                  transform: rotate(-90deg);
               }
            }
         }
      }

      .PageProfile-window-changePassword {
         z-index: 3;

         display: flex;
         flex-direction: column;
         gap: 1rem;

         & > * {
            background: hsla(0, 0%, 0%, 0.03);
         }
         .PageProfile-window-changePassword-first {
            margin-bottom: 2rem;
         }
      }
   }
</style>
