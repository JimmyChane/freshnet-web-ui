<script>
import IconArrowDown from '@/assets/icon/arrowDown-000000.svg';
import Input from '@/components/Input.vue';
import Loading from '@/components/Loading.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import { onCreatedRoute } from '@/mixin';
import { PROFILE_ROUTE } from '@/router';

import SectionMain from './PageProfile-Section-Main.vue';
import SectionTitle from './PageProfile-Section-Title.vue';
import Section from './PageProfile-Section.vue';
import WindowChangePassword from './WindowChangePassword.vue';

export default {
  components: {
    NavigationBar,
    Loading,
    ButtonIcon,
    Input,
    Section,
    SectionTitle,
    SectionMain,
  },
  data: (c) => ({
    PROFILE_ROUTE,
    IconArrowDown,
    user: null,
    isLoading: false,
    scrollTop: 0,
  }),
  computed: {
    name: (c) => c.user.name,
    username: (c) => c.user.username,
    typeDisplay() {
      if (this.user.isTypeAdmin()) return 'Admin';
      if (this.user.isTypeStaff()) return 'Staff';
      if (this.user.isTypeCustomer()) return 'Customer';
      return 'Other';
    },
  },
  methods: {
    openWindowChangePassword() {
      const popupWindow = this.$store.dispatch('openPopupWindow', {
        component: WindowChangePassword,
      });
    },
  },
  created() {
    onCreatedRoute(PROFILE_ROUTE);
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.state.stores.login
      .dispatch('getUser')
      .then((user) => {
        this.isLoading = false;
        this.user = user;
      })
      .catch((error) => {
        this.$store.dispatch('snackbarShow', 'Failed to validate');
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
      <NavigationBar style="z-index: 2" :title="PROFILE_ROUTE.title" />

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
              :src="IconArrowDown"
              @click="() => openWindowChangePassword()"
            />
          </div>
        </Section>
      </div>
    </div>

    <Loading class="PageProfile-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
.PageProfile {
  position: relative;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
}
</style>
