<script>
   export default {
      props: {
         href: { type: String, default: "" },
         src: { type: String, default: "" },
         title1: { type: String, default: "" },
         title2: { type: String, default: "" },
         target: { type: String, default: "" },

         isScreenWide: { type: Boolean, default: false },
      },
   };
</script>

<template>
   <a
      class="ItemFloatingContactLink"
      :class="[isScreenWide ? 'ItemFloatingContactLink-isScreenWide' : '']"
      :href="href"
      :target="target"
   >
      <img class="ItemFloatingContactLink-icon" :src="src" />
      <div class="ItemFloatingContactLink-content">
         <span class="ItemFloatingContactLink-title1">{{ title1 }}</span>
         <span class="ItemFloatingContactLink-title2">{{ title2 }}</span>
      </div>
   </a>
</template>

<style lang="scss" scoped>
   .ItemFloatingContactLink {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 0.5em;
      border-radius: 2em;
      padding: 0.6em 1em;
      gap: 0.6em;
      line-height: 0.9;
      font-size: 1.2em;
      overflow: hidden;
      text-decoration: none;
      .ItemFloatingContactLink-icon {
         --size: 1.4em;
         width: var(--size);
         height: var(--size);
      }
      .ItemFloatingContactLink-content {
         width: 100%;
         display: none;
         flex-direction: column;
         align-items: flex-start;
         justify-content: center;
         opacity: 0;
         transition: var(--transition-duration);
         .ItemFloatingContactLink-title1 {
            font-size: 0.7em;
            font-weight: 600;
         }
         .ItemFloatingContactLink-title2 {
            font-weight: 600;
         }
      }

      --primary-color: #2196f3;
      --background-color-hover: #c0e4ff;
      --box-shadow-color: hsla(0, 0%, 0%, 0.6);

      --size: 3em;
      --width: 10em;

      width: var(--size);
      height: var(--size);
      cursor: pointer;
      box-shadow: 0.8em 1.5em 4em var(--box-shadow-color);
      // border: 0.1em solid var(--primary-color);
      color: var(--primary-color);
      background: white;
      transition: var(--transition-duration);
      &:hover {
         background: var(--background-color-hover);
      }
   }
   .ItemFloatingContactLink-isScreenWide {
      --size: 3em;
      width: 10em;
      .ItemFloatingContactLink-content {
         display: flex;
         opacity: 1;
         transition: var(--transition-duration);
      }
   }
</style>
