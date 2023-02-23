<script>
   export default {
      props: { item: { type: Object } },
      computed: {
         title: (c) => c.item.title,
         subtitle: (c) => c.item.subtitle,
         href: (c) => c.item.href,
         target: (c) => c.item.target,
      },
   };
</script>

<template>
   <a class="ContactGroupItem" :href="href" :target="target">
      <span class="ContactGroupItem-title">{{ title }}</span>
      <span class="ContactGroupItem-subtitle">{{ subtitle }}</span>
   </a>
</template>

<style lang="scss" scoped>
   .ContactGroupItem {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      text-decoration: none;
      color: black;
      padding: 0.5em 0.7em;
      border-radius: 0.5em;

      &:hover {
         text-decoration: underline;
      }

      .ContactGroupItem-title {
         font-size: 0.8em;
      }
      .ContactGroupItem-subtitle {
         font-size: 0.6em;
      }
   }
</style>
