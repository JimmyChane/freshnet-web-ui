<script>
   import ToggleButton from "@/components/button/ToggleButton.vue";

   export default {
      components: { ToggleButton },
      props: {
         item: { type: Object, default: () => null },
         title: { type: String, default: "" },
      },
      data: (c) => ({ value: undefined }),
      computed: {
         isLoading: (c) => c.settingStore.getters.isLoading,
      },
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidateValue();
         },
         item() {
            this.invalidateValue();
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
   <div class="ItemSetting-Toggle transition" @click="$refs.toggleButton.$el.click()">
      <span class="ItemSetting-Toggle-title" v-if="title">{{ title }}</span>
      <ToggleButton
         class="ItemSetting-Toggle-value"
         ref="toggleButton"
         :isLoading="isLoading"
         :isToggled="value"
         @click-toggle="(toggle) => item.updateValue(toggle)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .ItemSetting-Toggle {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 1rem 0.8rem;

      font-size: 0.9rem;
      background-color: hsl(0, 0%, 94%);
      cursor: pointer;

      &:hover {
         background-color: white;
      }
   }
</style>
