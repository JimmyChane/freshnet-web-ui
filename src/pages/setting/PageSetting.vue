<script>
   import ActionBarManage from "@/pages/manage/ActionBarManage.vue";
   import Empty from "@/components/Empty.vue";
   import GroupSetting from "./GroupSetting.vue";
   import SettingModule from "@/items/data/Setting.js";

   export default {
      key: "setting",
      title: "Settings",
      icon: { light: "setting-FFFFFF", dark: "setting-2A4858" },
      userPermissions: ["admin"],

      components: { ActionBarManage, Empty, GroupSetting },
      data() {
         return {
            scrollTop: 0,
            groups: [
               {
                  title: "Contacts",
                  actions: [
                     {
                        title: "Add",
                        icon: this.host.res("icon/add-000000.svg"),
                        click: () => console.log("click add"),
                     },
                  ],
               },
               {
                  title: "Location",
                  actions: [
                     {
                        title: "Edit",
                        icon: this.host.res("icon/edit-000000.svg"),
                        click: () => console.log("click edit"),
                     },
                  ],
               },
               {
                  title: "Product Page",
                  items: [
                     {
                        key: SettingModule.Key.PublicShowPrice,
                        title: "Show Price in View Mode",
                        type: "boolean",
                     },
                  ],
               },
            ],
         };
      },
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,
         settings: (c) => c.settingStore.getters.items,
      },
      methods: {
         refresh() {
            this.settingStore.dispatch("refresh");
         },
      },
      mounted() {
         this.refresh();
      },
   };
</script>

<template>
   <div class="PageSetting" @scroll="(event) => (scrollTop = event.target.scrollTop)">
      <ActionBarManage
         :class="['PageSetting-actionbar']"
         :hasShadow="scrollTop > 0"
         :title="$options.title"
         :rightMenus="[
            {
               key: 'refresh',
               title: 'Refresh',
               icon: host.res('icon/refresh-2A4858.svg'),
               click: () => refresh(),
            },
         ]"
         @click-drawer-expand="$emit('click-drawer-expand')"
      />

      <div class="PageSetting-body" v-if="settings.length">
         <GroupSetting v-for="group of groups" :key="group.title" :group="group" />
      </div>

      <Empty v-if="!settings.length && !isLoading" />
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

      .PageSetting-actionbar {
         width: 100%;
      }

      .PageSetting-body {
         width: 100%;
         max-width: 25rem;
         margin: 0 auto;
         padding: 1.8rem;
         padding-bottom: 8rem;
         gap: 2rem;

         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: flex-start;
      }
   }
</style>