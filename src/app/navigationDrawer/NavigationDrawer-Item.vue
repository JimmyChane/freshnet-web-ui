<script>
import { NavPage } from '@/app/NavPage';
import { NavView } from '@/app/NavView';
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import IconCustomers from '@/icon/IconCustomers.vue';
import IconDatabase from '@/icon/IconDatabase.vue';
import IconHome from '@/icon/IconHome.vue';
import IconProducts from '@/icon/IconMagnifyingGlass.vue';
import IconManage from '@/icon/IconManage.vue';
import IconOrder from '@/icon/IconOrder.vue';
import IconPaper from '@/icon/IconPaper.vue';
import IconProfile from '@/icon/IconProfile.vue';
import IconService from '@/icon/IconService.vue';
import IconSetting from '@/icon/IconSetting.vue';
import IconUsers from '@/icon/IconUsers.vue';

export default {
  components: {
    ButtonIcon,
    IconHome,
    IconProducts,
    IconPaper,
    IconManage,
    IconProfile,
    IconCustomers,
    IconService,
    IconOrder,
    IconUsers,
    IconDatabase,
    IconSetting,
  },
  props: {
    item: { type: [NavPage, NavView], default: () => null },
    isWide: { type: Boolean, default: true },
  },
  computed: {
    key() {
      return this.item?.key ?? '';
    },
    icon() {
      return this.item?.icon ?? null;
    },
    iconLight() {
      return this.icon?.light ?? '';
    },
    iconDark() {
      return this.icon?.dark ?? '';
    },
    iconUrl() {
      return this.iconDark;
      return this.isSelected ? this.iconLight : this.iconDark;
    },
    title() {
      const { title } = this.item;
      return this.isWide ? title : title.substring(0, 1);
    },

    isSelected() {
      return this.item.isSelected();
    },
  },
};
</script>

<template>
  <div class="LeftNavItem" :isSelected="`${isSelected}`" :isWide="`${isWide}`">
    <IconHome
      class="LeftNavItem-icon"
      v-if="key === 'home'"
      :isSelected="isSelected"
    />
    <IconProducts
      class="LeftNavItem-icon"
      v-else-if="key === 'product'"
      :isSelected="isSelected"
    />
    <IconPaper
      class="LeftNavItem-icon"
      v-else-if="key === 'print'"
      :isSelected="isSelected"
    />
    <IconManage
      class="LeftNavItem-icon"
      v-else-if="key === 'manage'"
      :isSelected="isSelected"
    />
    <IconProfile
      class="LeftNavItem-icon"
      v-else-if="key === 'profile'"
      :isSelected="isSelected"
    />
    <IconCustomers
      class="LeftNavItem-icon"
      v-else-if="key === 'customer'"
      :isSelected="isSelected"
    />
    <IconService
      class="LeftNavItem-icon"
      v-else-if="key === 'service'"
      :isSelected="isSelected"
    />
    <IconOrder
      class="LeftNavItem-icon"
      v-else-if="key === 'order'"
      :isSelected="isSelected"
    />
    <IconUsers
      class="LeftNavItem-icon"
      v-else-if="key === 'users'"
      :isSelected="isSelected"
    />
    <IconDatabase
      class="LeftNavItem-icon"
      v-else-if="key === 'database'"
      :isSelected="isSelected"
    />
    <IconSetting
      class="LeftNavItem-icon"
      v-else-if="key === 'setting'"
      :isSelected="isSelected"
    />
    <img class="LeftNavItem-icon" v-else-if="iconUrl" :src="iconUrl" />
    <span
      class="LeftNavItem-title"
      v-if="iconUrl ? isWide && title.length : true"
    >
      {{ title }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.LeftNavItem {
  border: none;
  text-align: center;
  font-size: 1em;
  background: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  color: var(--primary-color);

  .LeftNavItem-icon {
    --size: 1.2em;
    width: var(--size);
    height: var(--size);
    min-width: var(--size);
    min-height: var(--size);
    max-width: var(--size);
    max-height: var(--size);
    object-fit: scale-down;

    --secondary-color: rgba(0, 0, 0, 0.7);
  }
  .LeftNavItem-title {
    --size: 1.2em;
    flex-grow: 1;
    min-height: var(--size);
    text-align: start;
    font-size: 1em;
    font-weight: 600;
    line-height: 1.2;

    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.LeftNavItem[isWide='true'] {
  width: 100%;
  justify-content: space-between;
}
.LeftNavItem[isWide='false'] {
  align-items: center;
  justify-content: center;
  .LeftNavItem-title {
    width: var(--size);
    height: var(--size);
    min-width: var(--size);
    min-height: var(--size);
    max-width: var(--size);
    max-height: var(--size);
    align-items: center;
    justify-content: center;
  }
}
</style>
