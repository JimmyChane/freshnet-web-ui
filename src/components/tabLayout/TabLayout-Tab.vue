<script>
import { isFunction } from '@/U';

export default {
  props: {
    menu: { type: Object },
    isScreenWide: { type: Boolean, default: true },
  },
  computed: {
    title: (c) => c.menu.title,
    icon: (c) => c.menu.icon,
    count: (c) => c.menu.count,
    primaryColor: (c) => c.menu.primaryColor ?? 'black',
    primaryColorTint: (c) => c.menu.primaryColorTint ?? 'transparent',
  },
  methods: {
    isSelected() {
      const { menu } = this;

      if (!isFunction(menu.isSelected)) return false;

      return menu.isSelected(menu);
    },
    click() {
      if (!isFunction(this.menu.click)) return;
      this.menu.click(this.menu);
    },
  },
};
</script>

<template>
  <button
    :class="['TabLayout-Tab', 'transition']"
    :style="{
      '--primary-color': primaryColor,
      '--primary-color-tint': primaryColorTint,
    }"
    :isExpand="`${isSelected() || isScreenWide}`"
    :isSelected="`${isSelected()}`"
    @click="() => click()"
  >
    <img v-if="icon" class="TabLayout-Tab-icon" :src="icon" />
    <span v-if="title.length" :class="['TabLayout-Tab-title', 'transition']">
      {{ title }}
    </span>
    <span v-if="typeof count === 'number'" class="TabLayout-Tab-count">
      ({{ count }})
    </span>
  </button>
</template>

<style lang="scss" scoped>
.TabLayout-Tab {
  --primary-color: inherit;

  height: 2.4rem;
  border: none;
  border-radius: 0.8rem;
  font-size: 1rem;
  padding: 0.6rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  transition-timing-function: cubic-bezier(1, 0, 0, 1);

  .TabLayout-Tab-icon {
    z-index: 2;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0.25rem;
  }
  .TabLayout-Tab-title {
    z-index: 1;
    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 600;
    transition-timing-function: cubic-bezier(1, 0, 0, 1);
    font-size: 0.9em;
  }
  .TabLayout-Tab-count {
    min-width: max-content;
    font-size: 0.8em;
  }
}

.TabLayout-Tab[isExpand='true'] {
  width: 10rem;
  width: 9rem;
  gap: 0.2rem;
}
.TabLayout-Tab[isExpand='false'] {
  width: 4rem;
  gap: 0;
  .TabLayout-Tab-title {
    width: 0;
    height: 0;
    opacity: 0;
  }
}

.TabLayout-Tab[isSelected='true'] {
  background: var(--primary-color);
  color: white;
}
.TabLayout-Tab[isSelected='false'] {
  cursor: pointer;
  background: var(--primary-color-tint);
  color: var(--primary-color);

  &:hover {
    background: #e2e2e2;
  }
}
</style>
