<script>
   import ToggleButton from "@/components/button/ToggleButton.vue";

   export default {
      components: { ToggleButton },
      props: { item: { type: Object, default: () => null } },
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,

         key: (context) => context.item.key,
         title: (context) => context.item.title,

         setting() {
            return this.settingStore.getters.items.find((setting) => {
               return setting.key === this.key;
            });
         },

         value() {
            return "No. 14, Ground Floor, Jalan Melati 3/3, Bandar Melawati, 45000, Kuala Selangor, Selangor Darul Ehsan";

            if (!this.setting) return undefined;
            return this.setting.value;
         },
      },
      methods: {
         update(value) {
            if (this.key === undefined) return;
            this.settingStore.dispatch("updateItem", { key: this.key, value });
         },
      },
   };
</script>

<template>
   <div class="ItemSetting_TextArea">
      <span class="ItemSetting_TextArea-title" v-if="title">{{ title }}</span>
      <textarea class="ItemSetting_TextArea-value" :value="value" />
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting_TextArea {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;

      background-color: hsla(0, 0%, 100%, 0.6);
      transition: var(--transition-duration);

      &:hover {
         background-color: white;
      }

      .ItemSetting_TextArea-value {
         width: 100%;
         height: 6rem;
         min-height: 4rem;
         background: none;
         border: none;
         font-size: 1rem;
         resize: vertical;
         padding: 1rem 0.8rem;
      }
   }
</style>
