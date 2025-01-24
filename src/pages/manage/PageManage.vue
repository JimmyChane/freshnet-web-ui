<script>
import IconPack from '@/app/IconPack';
import Server from '@/host/Server';
import PageCustomer from '@/pages/customer/PageCustomer.vue';
import PageDatabase from '@/pages/database/PageDatabase.vue';
import PageOrder from '@/pages/order/PageOrder.vue';
import PageProfile from '@/pages/profile/PageProfile.vue';
import PageService from '@/pages/service/PageService.vue';
import PageSetting from '@/pages/setting/PageSetting.vue';
import PageUsers from '@/pages/users/PageUsers.vue';

export default {
  key: 'manage',
  name: 'Manage',
  title: 'Manage',
  icon: new IconPack(
    Server.resource.icon('manage-FFFFFF'),
    Server.resource.icon('manage-000000'),
  ),

  _children() {
    return [PageProfile];
  },
  _groups() {
    return [
      {
        key: 'record',
        title: 'Record',
        children: [PageCustomer, PageService, PageOrder],
      },
      {
        key: 'system',
        title: 'System',
        children: [PageUsers, PageDatabase, PageSetting],
      },
    ];
  },

  userPermissions: ['admin', 'staff'],

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
