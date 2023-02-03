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
   <div
      class="ItemSetting_Toggle transition"
      @click="$refs.toggleButton.$el.click()"
   >
      <span class="ItemSetting_Toggle-title" v-if="title">{{ title }}</span>
      <ToggleButton
         class="ItemSetting_Toggle-value"
         ref="toggleButton"
         :isLoading="isLoading"
         :isToggled="value"
         @click-toggle="(toggle) => update(toggle)"
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
