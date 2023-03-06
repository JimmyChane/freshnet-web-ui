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
   <div class="ItemSetting_Toggle transition" @click="$refs.toggleButton.$el.click()">
      <span class="ItemSetting_Toggle-title" v-if="title">{{ title }}</span>
      <ToggleButton
         class="ItemSetting_Toggle-value"
         ref="toggleButton"
         :isLoading="isLoading"
         :isToggled="value"
         @click-toggle="(toggle) => item.updateValue(toggle)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting_Toggle {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 1rem 0.8rem;

      background-color: hsla(0, 0%, 100%, 0.6);
      cursor: pointer;

      &:hover {
         background-color: white;
      }
   }
</style>
