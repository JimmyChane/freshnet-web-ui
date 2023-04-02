<script>
   import ItemSettingHeader from "./ItemSetting-Header.vue";
   import U from "@/U";

   export default {
      components: { ItemSettingHeader },
      data: (c) => ({ U, isEditing: false, value: undefined, nextValue: "" }),
      props: { item: { type: Object, default: () => null } },
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,
         isEmpty: (c) => !U.optString(c.value).length,
         title: (c) => c.item.getTitle(),
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
            if (this.isEditing) {
               this.nextValue = this.value;
               this.$refs.textarea.focus();
            } else {
               this.nextValue = "";
               this.$refs.textarea.blur();
            }
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
      <ItemSettingHeader
         class="ItemSetting-header"
         :title="title"
         :actions="actions"
      />

      <textarea
         :class="[
            'transition',
            'ItemSetting-TextArea-value',
            'ItemSetting-TextArea-textarea',
            isEditing
               ? 'ItemSetting-TextArea-textarea-isShowing'
               : 'ItemSetting-TextArea-textarea-isHiding',
         ]"
         ref="textarea"
         v-model="nextValue"
      />
      <p
         :class="['ItemSetting-TextArea-value', 'ItemSetting-TextArea-p']"
         v-if="!isEmpty"
         >{{ value }}</p
      >
      <span
         :class="[
            'transition',
            'ItemSetting-TextArea-empty',
            !isEditing && isEmpty
               ? 'ItemSetting-TextArea-empty-isShowing'
               : 'ItemSetting-TextArea-empty-isHiding',
         ]"
         >Empty</span
      >
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
      background: white;

      .ItemSetting-header {
         margin-top: -1rem;
         font-weight: 500;
         font-size: 0.9rem;
         padding: 0;
         color: hsl(0, 0%, 20%);
      }

      .ItemSetting-TextArea-value {
         width: 100%;
         padding: 0.8rem;
         font-size: 0.9rem;

         background: none;
         border-radius: 0.5rem;
         border: 1px solid rgba(0, 0, 0, 0.2);
      }

      .ItemSetting-TextArea-textarea {
         resize: none;
         background: hsl(0, 0%, 90%);
         --transition-timing: cubic-bezier(1, 0, 0, 1);
      }
      .ItemSetting-TextArea-textarea-isShowing {
         height: 10rem;
         margin-bottom: 0.5rem;
      }
      .ItemSetting-TextArea-textarea-isHiding {
         height: 0;
         padding-top: 0;
         padding-bottom: 0;
         border-color: transparent;
         background: transparent;
         margin-top: -1px;
         pointer-events: none;
         opacity: 0;
      }

      .ItemSetting-TextArea-empty {
         font-size: 0.8rem;
         color: hsl(0, 0%, 75%);
         --transition-timing: cubic-bezier(1, 0, 0, 1);
         --transition-delay: 2s;
         overflow: hidden;
      }
      .ItemSetting-TextArea-empty-isShowing {
         height: max-content;
      }
      .ItemSetting-TextArea-empty-isHiding {
         height: 0;
         margin-top: -1px;
      }
   }
</style>
