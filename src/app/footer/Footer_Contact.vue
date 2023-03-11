<script>
   export default {
      props: {
         title: { type: String, default: "" },
         subtitle: { type: String, default: "" },
         links: { type: Array, default: () => [] },
      },
      computed: {
         primaryLink: (c) => (c.parsedLinks.length ? c.parsedLinks[0] : null),
         parsedLinks() {
            return this.links.map((link) => {
               return {
                  icon: link.icon,
                  href: link.href,
                  target: link ? link.target : "",
               };
            });
         },
      },
   };
</script>

<template>
   <div class="PageHomeFooterContact">
      <div class="PageHomeFooterContact-header">
         <span class="PageHomeFooterContact-title" v-if="title">{{ title }}</span>

         <a
            class="PageHomeFooterContact-primaryLink"
            v-if="primaryLink"
            :href="primaryLink.href"
            :target="primaryLink.target"
         >
            <span class="PageHomeFooterContact-subtitle">{{ subtitle }}</span>
         </a>
         <span class="PageHomeFooterContact-subtitle" v-else>{{ subtitle }}</span>
      </div>

      <div class="PageHomeFooter-links">
         <a
            class="PageHomeFooterContact-link"
            v-for="link of links"
            :key="link.href"
            :href="link.href"
            :target="link.target"
         >
            <img class="PageHomeFooterContact-icon" :src="link.icon" />
         </a>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PageHomeFooterContact {
      width: 100%;
      gap: 1rem;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;

      .PageHomeFooterContact-header {
         display: flex;
         flex-direction: column;
         flex-wrap: nowrap;
         align-items: flex-start;
         justify-content: center;

         font-weight: 400;
         text-align: start;
         .PageHomeFooterContact-title {
            font-size: 0.9rem;
         }

         .PageHomeFooterContact-primaryLink {
            color: inherit;
            text-decoration: inherit;
            font-size: inherit;

            &:hover {
               text-decoration: underline;
            }
         }
         .PageHomeFooterContact-subtitle {
            font-size: 1rem;
            opacity: 1;
         }
      }

      .PageHomeFooter-links {
         gap: 0.1rem;

         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: flex-start;
         .PageHomeFooterContact-link {
            --size: 2.5rem;
            width: var(--size);
            height: var(--size);
            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;
            .PageHomeFooterContact-icon {
               --size: 1.2rem;
               width: var(--size);
               height: var(--size);
            }

            &:hover {
               background-color: hsla(0, 0%, 0%, 0.1);
            }
         }
      }
   }
</style>
