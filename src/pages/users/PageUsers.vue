<script>
import { optNumber } from '@/U';
import IconAdd from '@/assets/icon/add-000000.svg';
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import Empty from '@/components/Empty.vue';
import Loading from '@/components/Loading.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import { onCreatedRoute } from '@/mixin';
import { USERS_ROUTE } from '@/router';
import { useAppStore } from '@/stores/app.store';
import { useLoginStore } from '@/stores/login.store';
import { useUserStore } from '@/stores/user.store';

import ItemUser from './ItemUser.vue';
import WindowAdd from './WindowAdd.vue';
import WindowChange from './WindowChange.vue';
import WindowRemove from './WindowRemove.vue';

export default {
  components: { NavigationBar, Loading, Empty, ItemUser },
  data() {
    return { USERS_ROUTE, IconAdd, IconRefresh };
  },
  computed: {
    isLoading: (c) => useUserStore().isLoading,
    isCurrentUserAdmin: (c) => (c.user ? c.user.isTypeAdmin() : false),

    user: (c) => useLoginStore().user,
    users: (c) => {
      return (!c.user.isTypeNone() ? useUserStore().items : []).sort(
        (user1, user2) => {
          if (user1.username === c.user.username) return -1;
          if (user2.username === c.user.username) return 1;
          return 0;
        },
      );
    },
  },
  created() {
    onCreatedRoute(USERS_ROUTE);
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
      useUserStore()
        .refresh()
        .catch((error) => {
          useAppStore().snackbarShow('Failed to validate user');
        });
    },

    async openWindowAdd() {
      const popupWindow = await useAppStore().openPopupWindow({
        component: WindowAdd,
        onConfirm: async (data) => {
          try {
            const user = await useUserStore().addUser({
              username: data.username,
              name: data.name,
              passwordNew: data.passwordNew,
              passwordRepeat: data.passwordRepeat,
            });

            if (user) {
              popupWindow.close();
              return;
            }
            useAppStore().snackbarShow('Failed to add user');
            throw new Error();
          } catch (error) {
            useAppStore().snackbarShow('Error to add user');
          }
        },
      });
    },
    async openWindowRemove(user) {
      const popupWindow = await useAppStore().openPopupWindow({
        component: WindowRemove,
        onConfirm: async () => {
          try {
            const result = await useUserStore().removeUserByUsername({
              username: user.username,
            });

            if (result) {
              popupWindow.close();
              return;
            }
            useAppStore().snackbarShow('Failed to remove user');
            throw new Error();
          } catch (error) {
            useAppStore().snackbarShow('Error to remove user');
          }
        },
      });
    },
    async openWindowChange(user) {
      const popupWindow = await useAppStore().openPopupWindow({
        component: WindowChange,
        user,
        userType: user.userType,
        onConfirm: async (data) => {
          try {
            const userTypeNumber = optNumber(Number.parseInt(data.userType), 0);

            const userChange = await useUserStore().updateTypeOfUserByUsername({
              username: data.user.username,
              userType: userTypeNumber,
            });
            if (userChange) {
              popupWindow.close();
              return;
            }
            useAppStore().snackbarShow('Failed to change user priviledge');
            throw new Error();
          } catch (error) {
            useAppStore().snackbarShow('Error to change user priviledge');
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
      :title="USERS_ROUTE.title"
      :rightMenus="[
        isCurrentUserAdmin
          ? {
              key: 'addUser',
              title: 'Add User',
              icon: IconAdd,
              click: () => openWindowAdd(),
            }
          : null,
        {
          key: 'refresh',
          title: 'Refresh',
          icon: IconRefresh,
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
      :icon="USERS_ROUTE.icon.dark.toUrl()"
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
