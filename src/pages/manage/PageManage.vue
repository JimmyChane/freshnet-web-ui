<script>
import { MANAGE_ROUTE } from '@/router';

export default {
  computed: {
    user: (c) => c.$store.state.stores.login.getters.user,
  },
  watch: {
    user(userNow, userWas) {
      if (!userWas.isTypeNone() && userNow.isTypeNone()) {
        this.redirectToLogin();
      }
    },
  },
  methods: {
    clickLogout() {
      if (!this.user.isTypeNone()) {
        this.$store.state.stores.login
          .dispatch('logout')
          .then(() => this.redirectToLogin());
      }
    },
    redirectToLogin() {
      this.$router.replace({
        path: '/login',
        query: { redirect: this.$router.currentRoute.fullPath },
      });
    },
  },
  created() {
    onCreatedRoute(MANAGE_ROUTE);
  },
  async mounted() {
    try {
      const user = await this.$store.state.stores.login.dispatch('getUser');
      if (user.isTypeNone()) this.redirectToLogin();
    } catch (error) {
      this.redirectToLogin();
    }
  },
};
</script>

<template>
  <div class="PageManage">
    <router-view v-if="!user.isTypeNone()" />
  </div>
</template>

<style lang="scss" scoped>
.PageManage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
}
</style>
