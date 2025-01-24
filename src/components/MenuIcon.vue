<script>
import Icon from './Icon.vue';
import Menu from './Menu.vue';

export default {
  Width: Menu.Width,
  Corner: Menu.Corner,

  components: { Menu, Icon },
  props: {
    width: { type: Number, default: Menu.Width.AUTO },
    corner: { type: Number, default: Menu.Corner.AUTO },
    menus: { default: undefined },

    src: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
};
</script>

<template>
  <Menu
    class="MenuIcon"
    :width="width"
    :corner="corner"
    :menus="menus"
    @mouseover="(x) => $emit('mouseover', x)"
    @mouseleave="(x) => $emit('mouseleave', x)"
    @show="() => $emit('show')"
    @hide="() => $emit('hide')"
  >
    <Icon :src="src" :alt="alt" />
  </Menu>
</template>

<style lang="scss" scoped>
.MenuIcon {
  font-size: 1rem;
  font-weight: 600;

  --size: 2.7em;
  min-width: var(--size);
  min-height: var(--size);
  width: var(--size);
  height: var(--size);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  background: none;
  border: none;
  border-radius: 50%;

  overflow: hidden;

  &:hover,
  &:focus-within {
    background: hsla(0, 0%, 0%, 0.1);
  }
}
</style>
