<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Empty from "@/components/Empty.vue";
   import ItemSetting from "./ItemSetting.vue";
   import SettingModule from "@/items/data/Setting.js";

   import HostIcon from "@/host/HostIcon";
   import U from "@/U";
   import Vue from "vue";

   class SettingBuilder {
      static key(key) {
         return new SettingBuilder().key(key);
      }
      static title(title) {
         return new SettingBuilder().title(title);
      }
      static type(type) {
         return new SettingBuilder().title(type);
      }
      static list(...list) {
         return new SettingBuilder().list(list);
      }

      key(key = "") {
         this.key = key;
         return this;
      }
      title(title = "") {
         this.title = title;
         return this;
      }
      type(type = "") {
         this.type = type;
         return this;
      }
      list(...list) {
         this.list = list;
         return this;
      }
      build() {
         const setting = new Setting();
         setting.key = this.key;
         setting.title = this.title;
         setting.type = this.type;

         if (U.isArray(this.list)) {
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
         return U.optString(this.key);
      }
      getTitle() {
         return U.optString(this.title);
      }
      getParentTitle() {
         return this.parent?.getTitle() ?? "";
      }

      getType() {
         return U.optString(this.type);
      }
      getList() {
         return U.optArray(this.list);
      }

      findValue() {
         return Vue.prototype.settingStore.getters.items.find((setting) => {
            return setting.key === this.key;
         });
      }
      async updateValue(value) {
         if (!this.getKey().length) return;

         const data = { key: this.getKey(), value };
         await Vue.prototype.settingStore.dispatch("updateItem", data);
      }
   }

   export default {
      key: "setting",
      title: "Settings",
      icon: {
         light: new HostIcon("setting-FFFFFF.svg"),
         dark: new HostIcon("setting-000000.svg"),
      },
      userPermissions: ["admin"],

      components: { NavigationBar, Empty, ItemSetting },
      data: (c) => ({
         SettingModule,
         SettingBuilder,
         scrollTop: 0,

         list: [
            // SettingBuilder.title("Company (not implemented)").list(
            //    SettingBuilder.title("Name (not implemented)").type("text"),
            //    SettingBuilder.title("Category (not implemented)").type("text"),
            // ),
            SettingBuilder.key(SettingModule.Key.Contacts)
               .title("Contacts (not implemented)")
               .type("array-text"),
            SettingBuilder.title("Location").list(
               // SettingBuilder.title("Brief Address Name (not implemented)").type("text"),
               SettingBuilder.key(SettingModule.Key.Location)
                  .title("Address")
                  .type("text"),
               SettingBuilder.key(SettingModule.Key.LocationLink)
                  .title("Link")
                  .type("text"),
            ),
            // SettingBuilder.title("Business Hours (not implemented)"),
            SettingBuilder.title("Product Page").list(
               SettingBuilder.key(SettingModule.Key.PublicShowPrice)
                  .title("Show Price in View Mode")
                  .type("boolean"),
            ),
         ].map((item) => item.build()),
      }),
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,
         isEmpty: (c) => !c.settingStore.getters.items.length,
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
   <div
      class="PageSetting"
      @scroll="(event) => (scrollTop = event.target.scrollTop)"
   >
      <NavigationBar
         :title="$options.title"
         :rightMenus="[
            {
               key: 'refresh',
               title: 'Refresh',
               icon: host.icon('refresh-000000'),
               click: () => refresh(),
            },
         ]"
      />

      <div class="PageSetting-body">
         <ItemSetting
            v-for="item of list"
            :key="item.getTitle()"
            :item="item"
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
