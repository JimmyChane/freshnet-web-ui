<script>
import { useAppStore } from '@/stores/app.store';
import { useLoginStore } from '@/stores/login.store';

import Input from '@/components/Input.vue';
import PanelAction from '@/components/panel/PanelAction.vue';

export default {
  components: { PanelAction, Input },
  props: { popupWindow: { type: Object } },
  data: (c) => ({
    passwordVerify: '',
    passwordNew: '',
    passwordRepeat: '',
  }),
  computed: {
    isShowing: (c) => c.popupWindow.isShowing,
  },
  methods: {
    commitValues() {
      const { passwordVerify, passwordNew, passwordRepeat } = this;

      if (passwordNew !== passwordRepeat) {
        useAppStore().snackbarShow(
          'Repeat Password Not Match With New Password',
        );
        return;
      }

      useLoginStore()
        .changePassword({ passwordVerify, passwordNew })
        .then((user) => this.popupWindow.close())
        .catch((error) =>
          useAppStore().snackbarShow('Changing Password Error'),
        );
    },
  },
};
</script>

<template>
  <PanelAction
    title="Change Your Password"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => commitValues()"
  >
    <div class="WindowChangePassword">
      <Input
        class="WindowChangePassword-first"
        type="password"
        label="Current Password"
        :bindValue="passwordVerify"
        :isRequired="true"
        @input="(comp) => (passwordVerify = comp.value)"
      />

      <Input
        type="password"
        label="New Password"
        :bindValue="passwordNew"
        :isRequired="true"
        @input="(comp) => (passwordNew = comp.value)"
      />

      <Input
        type="password"
        label="Repeat Password"
        :bindValue="passwordRepeat"
        :isRequired="true"
        @input="(comp) => (passwordRepeat = comp.value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowChangePassword {
  z-index: 3;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > * {
    background: hsla(0, 0%, 0%, 0.03);
  }
  .WindowChangePassword-first {
    margin-bottom: 2rem;
  }
}
</style>
