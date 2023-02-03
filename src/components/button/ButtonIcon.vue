<script>
   import Icon from "@/components/Icon.vue";
   export default {
      components: { Icon },
      props: {
         src: { type: String, default: "" },
         alt: { type: String, default: "" },
         href: { type: String, default: "" },
         target: { type: String, default: "_blank" },
      },
   };
</script>

<template>
   <a
      class="ButtonIcon transition"
      v-if="href.length"
      :href="href"
      :target="target"
      @click="$emit('click')"
      @mouseover="(x) => $emit('mouseover', x)"
      @mouseleave="(x) => $emit('mouseleave', x)"
   >
      <Icon :src="src" :alt="alt" />
   </a>
   <button
      class="ButtonIcon"
      v-else
      @click="$emit('click')"
      @mouseover="(x) => $emit('mouseover', x)"
      @mouseleave="(x) => $emit('mouseleave', x)"
   >
      <Icon :src="src" :alt="alt" />
   </button>
</template>

<style lang="scss" scoped>
   .ButtonIcon {
      font-size: 1rem;

      --size: 2.8em;
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      border-radius: 50%;
      padding: 0.7em;
      background: none;
      border: none;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      &:hover,
      &:focus {
         background: rgba(0, 0, 0, 0.1);
      }
   }
</style>
