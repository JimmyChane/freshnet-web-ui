<script>
   import ItemSettingHeader from "./ItemSetting-Header.vue";
   import ToggleButton from "@/components/button/ToggleButton.vue";

   export default {
      components: { ItemSettingHeader, ToggleButton },
      data: (c) => ({ isEditing: false, value: undefined, nextValue: "" }),
      props: {
         item: { type: Object, default: () => null },
         title: { type: String, default: "" },
      },
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,
         actions: (c) => {
            if (c.isEditing) {
               return [
                  {
                     title: "Discard",
                     icon: c.host.icon("close-000000"),
                     click: () => (c.isEditing = false),
                  },
                  {
                     title: "Save",
                     icon: c.host.icon("save-000000"),
                     click: async () => {
                        if (!c.isEditing) return;
                        if (!c.nextValue.trim().length) return;
                        await c.item.updateValue(c.nextValue);
                        c.isEditing = false;
                     },
                  },
               ];
            }

            return [
               {
                  title: "Edit",
                  icon: c.host.icon("edit-000000"),
                  click: () => (c.isEditing = true),
               },
            ];
         },
      },
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidateValue();
         },
         item() {
            this.invalidateValue();
         },
         isEditing() {
            this.nextValue = this.isEditing ? this.value : "";
         },
      },
      mounted() {
         this.invalidateValue();
      },
      methods: {
         invalidateValue() {
            const setting = this.item.findValue();
            this.value = setting ? setting.value : undefined;
         },
      },
   };
</script>

<template>
   <div :class="['ItemSetting-TextArea', 'transition']">
      <ItemSettingHeader class="ItemSetting-header" :title="title" :actions="actions" />
      <textarea
         :class="['ItemSetting-TextArea-value-textarea', 'ItemSetting-TextArea-value']"
         v-if="isEditing"
         v-model="nextValue"
      />
      <p :class="['ItemSetting-TextArea-value-p', 'ItemSetting-TextArea-value']" v-else>{{
         value
      }}</p>
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting-TextArea {
      width: 100%;
      padding: 1rem;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      background-color: hsl(0, 0%, 94%);

      .ItemSetting-header {
         margin-top: -1rem;
         font-weight: 400;
         font-size: 0.9rem;
         padding: 0;
      }

      .ItemSetting-TextArea-value {
         width: 100%;
         min-height: 4rem;
         padding: 0.8rem;

         background: none;
         font-size: 1rem;
         border-radius: 0.5rem;
         border: 1px solid rgba(0, 0, 0, 0.2);
      }
      .ItemSetting-TextArea-value-textarea {
         height: 10rem;
         resize: vertical;
         background-color: white;
      }
   }
</style>
