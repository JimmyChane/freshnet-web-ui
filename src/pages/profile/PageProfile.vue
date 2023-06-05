<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Loading from "@/components/Loading.vue";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   import WindowAction from "@/components/window/WindowAction.vue";
   import Input from "@/components/Input.vue";
   import Section from "./PageProfile-Section.vue";
   import SectionTitle from "./PageProfile-Section-Title.vue";
   import SectionMain from "./PageProfile-Section-Main.vue";

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
         WindowAction,
         Input,
         Section,
         SectionTitle,
         SectionMain,
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
            <Section class="PageProfile-introduction">
               <div class="PageProfile-introduction-body">
                  <span class="PageProfile-user-name">Hello, {{ name }}</span>
                  <div class="PageProfile-user-main">
                     <SectionTitle :title="`@${username}`" />
                     <SectionTitle :title="typeDisplay" />
                  </div>
               </div>
            </Section>

            <Section>
               <SectionTitle title="Sessions" />
               <SectionMain>Built in progress</SectionMain>
            </Section>

            <Section>
               <div class="PageProfile-section-changePassword">
                  <div class="PageProfile-section-changePassword-body">
                     <SectionTitle title="Change Your Password" />
                     <SectionMain>Also signing out other session</SectionMain>
                  </div>
                  <ButtonIcon
                     class="PageProfile-section-changePassword-arrow"
                     :src="host.icon('arrowDown-000000')"
                     @click="window.changePassword.isShowing = true"
                  />
               </div>
            </Section>
         </div>
      </div>

      <WindowAction
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
      </WindowAction>

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

            .PageProfile-introduction {
               .PageProfile-introduction-body {
                  width: 20em;
                  max-width: 100%;
                  background: hsla(0, 0%, 0%, 0.8);
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
