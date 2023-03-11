<script>
   import Contact from "./Footer_Contact.vue";
   import Company from "@/host/Company";
   import Setting from "@/items/data/Setting";

   export default {
      components: { Contact },
      data: (c) => ({ address: "", addressHref: "" }),
      computed: {
         contacts() {
            return Company.Contacts.toArray().map((contact) => {
               const links = contact.links.map((link) => {
                  return {
                     icon: link.category.icon,
                     href: link.toHtmlHref(),
                     target: link.toHtmlTarget(),
                  };
               });

               return { title: contact.title, subtitle: contact.links[0].id, links };
            });
         },
      },
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.address = await this.settingStore.dispatch("findValueOfKey", {
               key: Setting.Key.Location,
            });
            this.addressHref = await this.settingStore.dispatch("findValueOfKey", {
               key: Setting.Key.LocationLink,
            });
         },
      },
   };
</script>

<template>
   <div class="PageHomeFooter">
      <div class="PageHomeFooter-main">
         <div class="PageHomeFooter-rows">
            <div class="PageHomeFooter-columns">
               <div class="PageHomeFooter-section">
                  <span class="PageHomeFooter-section-title">Service</span>
                  <router-link
                     class="PageHomeFooter-section-item"
                     :to="{ path: '/print' }"
                     >Photostat &amp; Printing</router-link
                  >
                  <!-- <span class="PageHomeFooter-section-item">Networking</span> -->
                  <!-- <span class="PageHomeFooter-section-item">Chop Stamp</span> -->
                  <!-- <span class="PageHomeFooter-section-item">CCTV</span> -->
                  <!-- <span class="PageHomeFooter-section-item">Name Card</span> -->
               </div>
            </div>

            <div class="PageHomeFooter-columns">
               <div class="PageHomeFooter-section">
                  <span class="PageHomeFooter-section-title">Contacts</span>
                  <Contact
                     v-for="contact of contacts"
                     :key="contact.subtitle"
                     :title="contact.title"
                     :subtitle="contact.subtitle"
                     :links="contact.links"
                  />
               </div>
            </div>

            <div
               class="PageHomeFooter-columns"
               v-if="addressHref.length || address.length"
            >
               <div class="PageHomeFooter-section">
                  <span class="PageHomeFooter-section-title">Location</span>
                  <a
                     :class="[
                        'PageHomeFooter-section-item',
                        'PageHomeFooter-section-item-link',
                     ]"
                     :href="addressHref"
                     target="__blank"
                     v-if="addressHref.length"
                  >
                     <p v-if="address.length">{{ address }}</p>
                     <p v-else>Click to navigate</p>
                  </a>
                  <p v-else-if="address.length" class="PageHomeFooter-section-item">{{
                     address
                  }}</p>
               </div>
            </div>
         </div>
      </div>

      <span class="PageHomeFooter-credit">Created by Jimmy & Rory</span>
   </div>
</template>

<style lang="scss" scoped>
   .PageHomeFooter {
      // --primary-color: #b6c4ce;
      // --primary-color: black;
      --primary-color: hsl(0, 0%, 20%);

      width: 100%;
      margin-top: 4rem;
      padding: 2rem;
      padding-bottom: 10rem;
      gap: 4rem;
      position: relative;

      text-decoration: none;
      background: black;
      background-color: var(--primary-color);
      // color: #1b303d;
      color: white;

      display: flex;
      flex-direction: column;
      align-items: center;

      .PageHomeFooter-main {
         max-width: var(--default-max-width);
         width: 100%;
         gap: 4rem;

         display: flex;
         flex-direction: column;
         align-items: flex-start;

         .PageHomeFooter-rows {
            width: 100%;
            row-gap: 2.5rem;
            row-gap: 3rem;
            row-gap: 2.5rem;
            column-gap: 5rem;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .PageHomeFooter-columns {
               row-gap: 2.5rem;
               column-gap: 5rem;
               width: max-content;
               display: flex;
               flex-direction: column;
               .PageHomeFooter-section {
                  width: 100%;
                  gap: 0.1rem;

                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: flex-start;
                  .PageHomeFooter-section-title {
                     width: 100%;
                     height: 2rem;
                     font-weight: 600;
                     font-size: 1.2rem;
                     text-align: start;
                  }
                  .PageHomeFooter-section-item {
                     width: 100%;
                     height: 2rem;
                     font-weight: 400;
                     text-align: start;
                     opacity: 1;

                     color: inherit;
                     text-decoration: none;
                  }
                  .PageHomeFooter-section-item-link {
                     &:hover {
                        text-decoration: underline;
                     }
                  }
               }
            }
         }
      }

      .PageHomeFooter-credit {
         position: absolute;
         bottom: 0;
         left: 0;
         padding: 0.4rem;

         font-weight: 400;
         font-size: 0.8rem;
         color: white;
         opacity: 0.7;

         text-align: center;
         width: 100%;
      }
   }
</style>
