<script>
   import U from "@/U";
   import SettingModule from "@/items/data/Setting.js";
   import ItemSettingHeader from "./ItemSetting-Header.vue";
   import BusinessHoursItem from "./ItemSettingBusinessHours-Item.vue";

   export default {
      name: "ItemSetting",
      components: { ItemSettingHeader, BusinessHoursItem },
      data: (c) => ({
         U,
         key: SettingModule.Key.CompanyWorkingHours,
         title: "Business Hours (Readonly)",
         values: [],
      }),
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      methods: {
         async invalidate() {
            this.values = await this.settingStore.dispatch("findValueOfKey", {
               key: this.key,
               default: [],
            });
         },
      },
      mounted() {
         this.invalidate();
      },
   };
</script>

<template>
   <div class="ItemSettingBusinessHours">
      <ItemSettingHeader :title="title" />

      <div class="ItemSettingBusinessHours-body">
         <BusinessHoursItem
            v-for="value of values"
            :key="value.title"
            :value="value"
         />
         <span class="ItemSettingBusinessHours-empty" v-if="!values.length"
            >Empty</span
         >
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemSettingBusinessHours {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-items: stretch;
      justify-content: flex-start;
      overflow: hidden;
      gap: 2px;
      border-radius: 1rem;

      .ItemSettingBusinessHours-body {
         padding: 1rem;
         gap: 0.2rem;

         display: flex;
         flex-direction: column;
         align-items: stretch;
         background: white;

         .ItemSettingBusinessHours-empty {
            font-size: 0.8rem;
            color: hsl(0, 0%, 75%);
         }
      }
   }
</style>
