<script>
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import Empty from "@/components/Empty.vue";
  import ItemSetting from "./ItemSetting.vue";
  import ItemSettingContacts from "./ItemSettingContacts.vue";
  import ItemSettingBusinessHours from "./ItemSettingBusinessHours.vue";
  import SettingModule from "@/items/Setting";

  import Vue from "vue";
  import Server from "@/host/Server";
  import IconPack from "@/app/IconPack";

  import IconRefresh from "@/assets/icon/refresh-000000.svg";
  import { isArray, optString } from "@/U";

  class SettingBuilder {
    setKey(key = "") {
      this.key = key;
      return this;
    }
    setTitle(title = "") {
      this.title = title;
      return this;
    }
    setType(type = "") {
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
      return this.parent?.getTitle() ?? "";
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
      return Vue.prototype.$store.state.stores.user.getters.items.find(
        (setting) => {
          return setting.key === this.key;
        },
      );
    }
    async updateValue(value) {
      if (!this.getKey().length) return;

      const data = { key: this.getKey(), value };
      await Vue.prototype.$store.state.stores.user.dispatch("updateItem", data);
    }
  }

  export default {
    key: "setting",
    title: "Settings",
    icon: new IconPack(
      Server.resource.icon("setting-FFFFFF"),
      Server.resource.icon("setting-000000"),
    ),
    userPermissions: ["admin"],

    components: {
      NavigationBar,
      Empty,
      ItemSetting,
      ItemSettingContacts,
      ItemSettingBusinessHours,
    },
    data: (c) => ({ IconRefresh, SettingModule, SettingBuilder }),
    computed: {
      isLoading: (c) => c.$store.state.stores.user.getters.isLoading,
      isEmpty: (c) => !c.$store.state.stores.user.getters.items.length,
    },
    methods: {
      refresh() {
        this.$store.state.stores.user.dispatch("refresh");
      },
    },
    mounted() {
      this.refresh();
    },
  };
</script>

<template>
  <div class="PageSetting">
    <NavigationBar
      :title="$options.title"
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
                .setKey(SettingModule.Key.CompanyName)
                .setReadonly(true)
                .setTitle('Name')
                .setType('text'),
              new SettingBuilder()
                .setKey(SettingModule.Key.CompanyCategory)
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
                .setKey(SettingModule.Key.Location)
                .setTitle('Address')
                .setType('text'),
              new SettingBuilder()
                .setKey(SettingModule.Key.LocationLink)
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
                .setKey(SettingModule.Key.PublicShowPrice)
                .setTitle('Show Price in View Mode')
                .setType('boolean'),
            )
            .build()
        "
      />
    </div>

    <Empty v-if="isEmpty && !isLoading" :icon="$options.icon.dark.toUrl()" />
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
