<script>
   import ToggleButton from "@/components/button/ToggleButton.vue";

   export default {
      components: { ToggleButton },
      props: {
         item: { type: Object, default: () => null },
         title: { type: String, default: "" },
      },
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,
         setting: (c) => c.item.findValue(),
         value: (c) => (c.setting ? c.setting.value : undefined),
      },
   };
</script>

<template>
   <div class="ItemSetting-TextArea transition">
      <span class="ItemSetting-TextArea-title" v-if="title.length">{{ title }}</span>
      <textarea class="ItemSetting-TextArea-value" :value="value" />
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting-TextArea {
      width: 100%;
      padding: 1rem;
      gap: 0.2rem;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      background-color: hsla(0, 0%, 100%, 0.6);

      &:hover {
         background-color: white;
      }

      .ItemSetting-TextArea-title {
         font-size: 0.8rem;
      }

      .ItemSetting-TextArea-value {
         --margin: 1rem;

         width: 100%;
         height: 6rem;
         min-height: 4rem;
         padding: 0.8rem;

         background: none;
         font-size: 1rem;
         resize: vertical;
         border: 1px solid rgba(0, 0, 0, 0.2);
         border-radius: 0.5rem;
      }
   }
</style>
