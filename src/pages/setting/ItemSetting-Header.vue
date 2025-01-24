<script>
import IconButton from '@/components/button/ButtonIcon.vue';

export default {
  components: { IconButton },
  props: {
    title: { type: String, default: '' },
    actions: { type: Array, default: () => [] },
  },
};
</script>

<template>
  <div class="ItemSetting-header" v-if="title.length || actions.length">
    <span class="ItemSetting-header-title" v-if="title.length">
      {{ title }}
    </span>

    <div class="ItemSetting-header-actions" v-if="actions.length">
      <IconButton
        class="transition"
        v-for="action of actions"
        :key="action.title"
        :src="action.icon"
        @click="action.click"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemSetting-header {
  --height: 3.2rem;
  width: 100%;
  height: var(--height);
  min-height: var(--height);
  max-height: var(--height);
  padding: 0.5rem;
  font-weight: 600;
  text-align: start;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  background: white;

  .ItemSetting-header-title {
    padding: inherit;
  }
  .ItemSetting-header-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;

    & > * {
      &:hover {
        background: hsl(0, 0%, 90%);
      }
      &:focus {
        transform: scale(0.8);
      }
    }
  }
}
</style>
