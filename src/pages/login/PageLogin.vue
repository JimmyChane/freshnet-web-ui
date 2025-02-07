<script>
import { mapStores } from 'pinia';

import Footer from '@/app/footer/Footer.vue';
import IconHamburgerMenu from '@/assets/icon/hamburgerMenu-000000.svg';
import Logo from '@/assets/logo/freshnet-enterprise-logo.svg';
import Input from '@/components/Input.vue';
import Loading from '@/components/Loading.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import { onCreatedContext } from '@/mixin';
import { useAppStore } from '@/stores/app.store';
import { useLoginStore } from '@/stores/login.store';

import ButtonLogin from './ButtonLogin.vue';

export default {
  title: 'Staff Login',

  components: { Loading, Input, ButtonLogin, Actionbar, Footer },
  data: (c) => ({
    Logo,
    IconHamburgerMenu,
    top: { shadow: false },
    usernameErrorText: '',
    passwordErrorText: '',
  }),
  computed: {
    ...mapStores(useAppStore),
    isLoading: (c) => useLoginStore().isLoading,
  },
  methods: {
    clickLogin() {
      let redirect = this.$route.query.redirect ?? '/home';

      const username = this.$refs.username.value;
      const password = this.$refs.password.value;
      this.usernameErrorText = '';
      this.passwordErrorText = '';

      if (username === '') this.usernameErrorText = 'Missing Field';
      if (password === '') this.passwordErrorText = 'Missing Field';
      if (username === '' || password == '') return;

      useLoginStore()
        .login({ username, password })
        .then((user) => setTimeout(() => this.$router.push(redirect), 200))
        .catch(() => {
          useAppStore().snackbarShow('Login failed');
          this.usernameErrorText = 'Check your username';
          this.passwordErrorText = 'Check your password';
        });
    },
  },
  created() {
    onCreatedContext(this);
  },
  async mounted() {
    let user = await useLoginStore().getUser();
    if (user.isTypeNone()) return;
    if (!this.$route.query.redirect) return;
    this.$router.replace({ path: this.$route.query.redirect });
  },
};
</script>

<template>
  <div
    class="PageLogin"
    @scroll="(event) => (top.shadow = event.target.scrollTop > 0)"
  >
    <Loading class="PageLogin-Loading" :isShowing="isLoading" />

    <Actionbar
      class="PageLogin-top transition"
      v-if="appStore.navigation.isDrawer()"
      :leftMenus="[
        {
          title: 'Hamburger Menu',
          icon: IconHamburgerMenu,
          click: () => appStore.navigation.openNavigationDrawer(),
        },
        {
          key: 'home',
          title: 'Home',
          icon: Logo,
          click: () => this.$router.push('/home'),
        },
      ]"
    />

    <div class="PageLogin-main">
      <span class="PageLogin-title">Staff Login</span>

      <form class="PageLogin-content" @submit.prevent="clickLogin()">
        <Input
          class="PageLogin-input"
          ref="username"
          label="Username"
          type="text"
          :autocorrect="'off'"
          :autocapitalize="'none'"
          @input="
            (comp) => {
              let value = comp.value;
              if (value.includes(''))
                comp.value = value.trim().replace(' ', '');
            }
          "
          :isRequired="true"
          :error="usernameErrorText"
        />
        <Input
          class="PageLogin-input"
          ref="password"
          label="Password"
          type="password"
          :isRequired="true"
          :error="passwordErrorText"
        />

        <ButtonLogin />
      </form>
    </div>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.PageLogin {
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  color: black;
  overflow-y: auto;
  z-index: 1;

  --max-width: 28em;

  .PageLogin-Loading {
    z-index: 3;
    position: fixed;
    top: 0;
    width: 100%;
  }

  .PageLogin-top {
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    position: sticky;
  }

  .PageLogin-main {
    z-index: 1;
    width: 100%;
    min-height: max-content;
    height: 100dvh;
    max-height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 1em;
    padding: 2em;

    .PageLogin-title {
      width: 100%;
      max-width: var(--max-width);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      color: rgba(0, 0, 0, 0.8);

      font-size: 4rem;
      line-height: 1.4;
    }

    .PageLogin-content {
      width: 100%;
      max-width: var(--max-width);
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;

      & > * {
        width: 100%;
      }

      .PageLogin-input {
        padding: 0.8rem 1rem;
      }
    }
  }
}
</style>
