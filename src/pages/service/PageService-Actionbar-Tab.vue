<script>
   export default {
      props: {
         item: { type: Object },
         isWide: { type: Boolean, default: false },
      },
      computed: {
         primaryColor: (context) => context.item.primaryColor,
         title: (context) => context.item.title,
         icon: (context) => context.item.icon,
         count: (context) => context.item.list.length,

         selfClasses: (context) => {
            const classes = [
               context.item.isSelected() ? "Tab-isSelected" : "Tab-isDeselected",
            ];

            if (context.isWide) classes.push("Tab-isWide");
            else classes.push(context.item.isSelected() ? "Tab-isWide" : "Tab-isThin");

            return classes;
         },
      },
   };
</script>

<template>
   <button
      :class="['Tab', 'transition', ...selfClasses]"
      :style="{ '--primary-color': primaryColor }"
      @click="item.click()"
   >
      <img class="Tab-icon" :src="icon" />
      <span class="Tab-title transition">{{ title }}</span>
      <span class="Tab-count">{{ count }}</span>
   </button>
</template>

<style lang="scss" scoped>
   .Tab {
      --primary-color: inherit;

      height: 2.4rem;
      border-radius: 0.8rem 0.8rem 0 0;

      border: 1px solid #acacac;
      border-bottom: none;
      background: none;
      font-size: 1rem;
      padding-top: 0.1rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      position: relative;

      .Tab-icon {
         z-index: 2;
         width: 1.5rem;
         height: 1.5rem;
         padding: 0.25rem;
      }
      .Tab-title {
         z-index: 1;
         text-align: start;
         text-overflow: ellipsis;
         white-space: nowrap;
         overflow: hidden;
         font-weight: 600;
         color: var(--primary-color);
      }
      .Tab-count {
         z-index: 3;
         position: absolute;
         top: 0.5em;
         right: 0.5em;
         font-size: 0.6rem;
         line-height: 1em;
         --primary-color: black;

         --size: 1.8em;
         width: var(--size);
         height: var(--size);
         min-height: var(--size);
         min-height: var(--size);
         max-height: var(--size);
         max-height: var(--size);

         display: flex;
         align-items: center;
         justify-content: center;

         background-color: var(--primary-color);
         border-radius: 50%;
         color: white;
      }
   }

   .Tab-isWide {
      width: 8.2rem;
      gap: 0.5rem;
      .Tab-title {
         width: 4.8rem;
      }
   }
   .Tab-isThin {
      width: 2.8rem;
      gap: 0;
      .Tab-title {
         width: 0;
         height: 0;
         opacity: 0;
      }
   }

   .Tab-isSelected {
      background-color: #e4e4e4;
      border-color: #acacac;
   }
   .Tab-isDeselected {
      background-color: transparent;
      border-color: transparent;
      cursor: pointer;

      &:hover {
         background-color: #e2e2e2;
      }
   }
</style>
