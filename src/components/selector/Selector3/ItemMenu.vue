<script>
   export default {
      emits: ["click"],
      props: {
         item: { type: Object, default: () => null },
         isSelected: { type: Boolean, default: false },
      },
      mounted(){
         console.log(this.item);
      }
   };
</script>

<template>
   <button
      class="ItemMenu transition"
      :class="[`ItemMenu-${isSelected ? 'selected' : 'deselected'}`]"
      :style="{
         '--primary-color': item.color ? item.color : 'inherit',
      }"
      @click="$emit('click')"
   >
      <img class="ItemMenu-icon" v-if="item.icon" :src="item.icon" />
      <span class="ItemMenu-title" v-if="item.title">{{ item.title }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .ItemMenu {
      border: 1px solid var(--primary-color);
      border-radius: 0.4rem;
      box-shadow: 0 0 4px hsl(0, 0%, 90%);
      font-size: 0.8em;
      padding: 0.6em 1.8em;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      .ItemMenu-icon {
         height: 1em;
      }
      .ItemMenu-title {
         width: max-content;
      }
   }
   .ItemMenu-selected {
      background: var(--primary-color);
      color: white;
   }
   .ItemMenu-deselected {
      background: white;
      color: var(--primary-color);
      cursor: pointer;
      &:hover,
      &:focus {
         background: var(--primary-color);
         color: white;
      }
   }
</style>
