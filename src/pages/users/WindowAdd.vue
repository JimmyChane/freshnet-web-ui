<script>
   import PanelAction from "@/components/panel/PanelAction.vue";
   import Input from "@/components/Input.vue";

   export default {
      components: { PanelAction, Input },
      props: {
         popupWindow: { type: Object },
      },
      computed: {
         isShowing: (c) => c.popupWindow.isShowing,
      },
      data: (c) => ({
         username: "",
         name: "",
         passwordNew: "",
         passwordRepeat: "",
      }),
      methods: {
         commit() {
            this.popupWindow.onConfirm({
               username: this.username,
               name: this.name,
               passwordNew: this.passwordNew,
               passwordRepeat: this.passwordRepeat,
            });
         },
      },
   };
</script>

<template>
   <PanelAction
      title="Add User"
      :isShowing="isShowing"
      @click-dismiss="() => popupWindow.close()"
      @click-cancel="() => popupWindow.close()"
      @click-ok="() => commit()"
   >
      <div class="PageUsers-window">
         <Input
            label="Username"
            :isRequired="true"
            :bindValue="username"
            @input="(comp) => (username = comp.value)"
         />
         <Input
            label="Name"
            autocapitalize="words"
            :isRequired="true"
            :bindValue="name"
            @input="(comp) => (name = comp.value)"
         />
         <Input
            label="Password"
            type="password"
            :isRequired="true"
            :bindValue="passwordNew"
            @input="(comp) => (passwordNew = comp.value)"
         />
         <Input
            label="Repeat Password"
            type="password"
            :isRequired="true"
            :bindValue="passwordRepeat"
            @input="(comp) => (passwordRepeat = comp.value)"
         />
      </div>
   </PanelAction>
</template>

<style lang="scss" scoped>
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
</style>
