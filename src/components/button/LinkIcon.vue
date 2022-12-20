<script>
   import Icon from "@/components/Icon.vue";
   export default {
      components: { Icon },
      props: {
         href: { type: String, default: "" },
         target: { type: String, default: "" },
         src: { type: String, default: "" },
         alt: { type: String, default: "" },
      },
   };
</script>

<template>
   <a class="LinkIcon" :href="href" :target="target">
      <Icon class="LinkIcon-icon" :src="src" :alt="alt" />
   </a>
</template>

<style lang="scss" scoped>
   .LinkIcon {
      font-size: 1rem;

      min-width: 2.5em;
      min-height: 2.5em;
      width: 2.5em;
      height: 2.5em;
      border-radius: 50%;
      padding: 0.7em;
      background: none;
      border: none;
      transition: var(--transition-duration);
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;
      &:hover,
      &:focus {
         background: rgba(0, 0, 0, 0.1);
      }

      .LinkIcon-icon {
         font-size: 1em;
         width: 100%;
         height: 100%;
      }
   }
</style>
