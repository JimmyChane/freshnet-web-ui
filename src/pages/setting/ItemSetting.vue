<script>
   import Card from "./ItemSetting-Card.vue";
   import ItemSettingHeader from "./ItemSetting-Header.vue";
   import Toggle from "./ItemSetting-Toggle.vue";
   import TextArea from "./ItemSetting-TextArea.vue";
   import U from "@/U";

   export default {
      name: "ItemSetting",
      components: { Card, ItemSettingHeader, Toggle, TextArea },
      props: {
         item: { type: Object, default: () => null },
         title: { type: String, default: "" },
      },
      data: (c) => ({ U }),
      computed: {
         isArrayText: (c) => U.optString(c.item.type) === "array-text",

         actions: (c) => {
            const actions = [];

            if (c.isArrayText) {
               actions.push({
                  title: "Add",
                  icon: c.host.icon("add-000000"),
                  click: () => console.log("click add"),
               });
            }

            return actions;
         },
         list: (c) => U.optArray(c.item.list),
      },
   };
</script>

<template>
   <Card>
      <ItemSettingHeader :title="item.getTitle()" :actions="actions" />

      <div
         class="ItemSetting-item"
         v-for="subItem in list"
         :key="`${subItem.getKey()}${subItem.getParentTitle()}${item.getTitle()}${item.getParentTitle()}`"
      >
         <TextArea
            v-if="subItem.type === 'text'"
            :item="subItem"
            :title="subItem.getTitle()"
         />
         <Toggle
            v-else-if="subItem.type === 'boolean'"
            :item="subItem"
            :title="subItem.getTitle()"
         />
         <ItemSetting v-else :item="subItem" />
      </div>
   </Card>
</template>

<style lang="scss" scoped>
   .ItemSetting-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
   }
</style>
