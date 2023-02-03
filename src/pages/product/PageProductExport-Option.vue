<script>
   export default {
      props: {
         menu: { type: Object, default: () => null },
      },
      computed: {
         title() {
            return this.menu.title;
         },
         content() {
            const content = this.menu.items.find((item) => item.isSelected());
            return content ? content.title : "";
         },
      },
   };
</script>

<template>
   <button class="ExportOption transition" @click="() => menu.click()">
      <span class="ExportOption-content">{{ content }}</span>
      <span class="ExportOption-title">{{ title }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .ExportOption {
      padding: 0.4rem 0.8rem;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      font-size: 1rem;
      cursor: pointer;
      background: none;
      border: none;
      border-radius: 0.2rem;

      &:hover {
         background: hsla(0, 0%, 0%, 0.1);
      }

      .ExportOption-title {
         font-size: 0.7rem;
      }
   }
</style>
