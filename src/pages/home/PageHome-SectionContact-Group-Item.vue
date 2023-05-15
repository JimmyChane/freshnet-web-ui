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
      <span>{{ title }}</span>
      <span>{{ subtitle }}</span>
   </a>
</template>

<style lang="scss" scoped>
   .ContactGroupItem {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;

      text-decoration: none;
      color: black;
      border-radius: 0.5em;
      font-size: 0.8em;
      column-gap: 0.5em;

      &:hover {
         text-decoration: underline;
      }
   }
</style>
