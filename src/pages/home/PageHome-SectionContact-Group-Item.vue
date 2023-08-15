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
    border-radius: 0.8em;
    font-size: 0.8em;
    column-gap: 0.5em;
    padding: 1.2em;

    border: 1px solid hsla(0, 0%, 0%, 0.1);
    transition: all 200ms linear;
    background: white;

    &:hover {
      text-decoration: underline;
      background: hsla(0, 0%, 0%, 0.05);
    }
  }
</style>
