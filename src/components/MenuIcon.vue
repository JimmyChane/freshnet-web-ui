<script>
   import Menu from "./Menu.vue";
   const Mode = { Show: "show", Hide: "hide" };

   export default {
      Mode,
      Width: Menu.Width,
      Corner: Menu.Corner,

      components: { Menu },
      props: {
         width: { type: Number, default: Menu.Width.AUTO },
         corner: { type: Number, default: Menu.Corner.BOTTOM_LEFT },
         menus: { default: undefined },

         src: { type: String, default: "" },
         alt: { type: String, default: "" },
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
      <img class="MenuIcon-icon" :src="src" :alt="alt" />
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
         background-color: hsla(0, 0%, 0%, 0.1);
      }

      .MenuIcon-icon {
         --size: 1.4em;
         min-width: var(--size);
         min-height: var(--size);
         width: var(--size);
         height: var(--size);
      }
   }
</style>
