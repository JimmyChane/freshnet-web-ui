<script>
import Vue from 'vue';

import { isArray, optString } from '@/U';
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import Empty from '@/components/Empty.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import { Setting as SettingModule } from '@/items/Setting';
import { onCreatedRoute } from '@/mixin';
import { SETTING_ROUTE } from '@/router';
import { useUserStore } from '@/stores/user.store';

import ItemSetting from './ItemSetting.vue';
import ItemSettingBusinessHours from './ItemSettingBusinessHours.vue';
import ItemSettingContacts from './ItemSettingContacts.vue';

class SettingBuilder {
  setKey(key = '') {
    this.key = key;
    return this;
  }
  setTitle(title = '') {
    this.title = title;
    return this;
  }
  setType(type = '') {
    this.type = type;
    return this;
  }
  setList(...list) {
    this.list = list;
    return this;
  }
  setReadonly(readonly = false) {
    this.readonly = readonly;
    return this;
  }
  build() {
    const setting = new Setting();
    setting.key = this.key;
    setting.title = this.title;
    setting.type = this.type;
    setting.readonly = this.readonly;

    if (isArray(this.list)) {
      setting.list = this.list.map((subSetting) => {
        if (subSetting instanceof SettingBuilder) {
          subSetting = subSetting.build();
        }

        subSetting.parent = setting;
        return subSetting;
      });
    }

    return setting;
  }
}

class Setting {
  getKey() {
    return optString(this.key);
  }
  getTitle() {
    return optString(this.title);
  }
  getParentTitle() {
    return this.parent?.getTitle() ?? '';
  }

  getType() {
    return optString(this.type);
  }
  getList() {
    return optArray(this.list);
  }
  isReadonly() {
    return this.readonly;
  }

  findValue() {
    return useUserStore().items.find((setting) => setting.key === this.key);
  }
  async updateValue(value) {
    if (!this.getKey().length) return;

    const data = { key: this.getKey(), value };
    await useUserStore().updateItem(data);
  }
}

export default {
  components: {
    NavigationBar,
    Empty,
    ItemSetting,
    ItemSettingContacts,
    ItemSettingBusinessHours,
  },
  data: (c) => ({ SETTING_ROUTE, IconRefresh, SettingModule, SettingBuilder }),
  computed: {
    isLoading: (c) => useUserStore().isLoading,
    isEmpty: (c) => !useUserStore().items.length,
  },
  methods: {
    refresh() {
      useUserStore().refresh();
    },
  },
  created() {
    onCreatedRoute(SETTING_ROUTE);
  },
  mounted() {
    this.refresh();
  },
};
</script>

<template>
  <div class="PageSetting">
    <NavigationBar
      :title="SETTING_ROUTE.title"
      :rightMenus="[
        {
          key: 'refresh',
          title: 'Refresh',
          icon: IconRefresh,
          click: () => refresh(),
        },
      ]"
    />

    <div class="PageSetting-body">
      <ItemSetting
        :item="
          new SettingBuilder()
            .setTitle('Company (Readonly)')
            .setReadonly(true)
            .setList(
              new SettingBuilder()
                .setKey(SettingKey.CompanyName)
                .setReadonly(true)
                .setTitle('Name')
                .setType('text'),
              new SettingBuilder()
                .setKey(SettingKey.CompanyCategory)
                .setReadonly(true)
                .setTitle('Category')
                .setType('text'),
            )
            .build()
        "
      />
      <ItemSetting
        :item="
          new SettingBuilder()
            .setTitle('Location')
            .setList(
              new SettingBuilder()
                .setKey(SettingKey.Location)
                .setTitle('Address')
                .setType('text'),
              new SettingBuilder()
                .setKey(SettingKey.LocationLink)
                .setTitle('Link')
                .setType('text'),
            )
            .build()
        "
      />
      <ItemSettingContacts />
      <ItemSettingBusinessHours />
      <ItemSetting
        :item="
          new SettingBuilder()
            .setTitle('Product Page')
            .setList(
              new SettingBuilder()
                .setKey(SettingKey.PublicShowPrice)
                .setTitle('Show Price in View Mode')
                .setType('boolean'),
            )
            .build()
        "
      />
    </div>

    <Empty
      v-if="isEmpty && !isLoading"
      :icon="SETTING_ROUTE.icon.dark.toUrl()"
    />
  </div>
</template>

<style lang="scss" scoped>
.PageSetting {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .PageSetting-body {
    width: 100%;
    max-width: 25rem;
    margin: 0 auto;
    padding: 1.8rem;
    padding-bottom: 8rem;
    gap: 0.8rem;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
}
</style>
