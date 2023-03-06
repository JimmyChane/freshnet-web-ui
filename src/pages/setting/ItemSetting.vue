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
         isGroup: (c) => !!c.item.getList().length,
         isSubGroup: (c) => !!c.item.parent,

         isBoolean: (c) => c.itemType === "boolean",
         isText: (c) => c.itemType === "text",
         isArrayText: (c) => c.itemType === "array-text",

         itemType: (c) => U.optString(c.item.type),

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
      <ItemSettingHeader :title="item.getParentTitle()" :actions="actions" />

      <ItemSetting
         v-for="subItem in list"
         :key="`${subItem.getKey()}${subItem.getParentTitle()}${item.getTitle()}${item.getParentTitle()}`"
         :item="subItem"
      />

      <TextArea v-if="isText" :item="item" :title="item.getTitle()" />
      <Toggle v-if="isBoolean" :item="item" :title="item.getTitle()" />
   </Card>
</template>
