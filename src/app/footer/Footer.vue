<script>
import { SettingKey } from '@/items/Setting';
import { useSettingStore } from '@/stores/setting.store';

import Contact from './Footer-Contact.vue';

export default {
  components: { Contact },
  data: (c) => ({ contacts: [], address: '', addressHref: '' }),
  computed: {
    lastModified() {
      return useSettingStore().lastModified;
    },
  },
  watch: {
    lastModified() {
      this.invalidate();
    },
  },
  mounted() {
    this.invalidate();
  },
  methods: {
    async invalidate() {
      this.address = await useSettingStore().findValueOfKey({
        key: SettingKey.Location,
      });
      this.addressHref = await useSettingStore().findValueOfKey({
        key: SettingKey.LocationLink,
      });

      const contacts = await useSettingStore().findValueOfKey({
        key: SettingKey.Contacts,
        default: [],
      });
      this.contacts = contacts.map((contact) => {
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
};
</script>

<template>
  <div class="Footer">
    <div class="Footer-main">
      <div class="Footer-rows">
        <div class="Footer-columns">
          <div class="Footer-section">
            <span class="Footer-section-title">Service</span>
            <router-link class="Footer-section-item" :to="{ path: '/print' }">
              Photostat &amp; Printing
            </router-link>
            <!-- <span class="Footer-section-item">Networking</span> -->
            <!-- <span class="Footer-section-item">Chop Stamp</span> -->
            <!-- <span class="Footer-section-item">CCTV</span> -->
            <!-- <span class="Footer-section-item">Name Card</span> -->
          </div>
        </div>

        <div class="Footer-columns">
          <div class="Footer-section">
            <span class="Footer-section-title">Contacts</span>
            <Contact
              v-for="contact of contacts"
              :key="contact.subtitle"
              :title="contact.title"
              :subtitle="contact.subtitle"
              :links="contact.links"
            />
          </div>
        </div>

        <div class="Footer-columns" v-if="addressHref.length || address.length">
          <div class="Footer-section">
            <span class="Footer-section-title">Location</span>
            <a
              :class="['Footer-section-item', 'Footer-section-item-link']"
              :href="addressHref"
              target="__blank"
              v-if="addressHref.length"
            >
              <p v-if="address.length">{{ address }}</p>
              <p v-else>Click to navigate</p>
            </a>
            <p v-else-if="address.length" class="Footer-section-item">
              {{ address }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <span class="Footer-credit">Created by Jimmy & Rory</span>
  </div>
</template>

<style lang="scss" scoped>
.Footer {
  --primary-color: hsl(0, 0%, 20%);

  width: 100%;
  margin-top: 4rem;
  padding: 2rem;
  padding-bottom: 10rem;
  gap: 4rem;
  position: relative;

  text-decoration: none;
  background: black;
  background: var(--primary-color);
  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;

  .Footer-main {
    max-width: var(--default-max-width);
    width: 100%;
    gap: 4rem;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .Footer-rows {
      width: 100%;
      row-gap: 2.5rem;
      row-gap: 3rem;
      row-gap: 2.5rem;
      column-gap: 5rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .Footer-columns {
        row-gap: 2.5rem;
        column-gap: 5rem;
        width: max-content;
        display: flex;
        flex-direction: column;
        .Footer-section {
          width: 100%;
          gap: 0.1rem;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          .Footer-section-title {
            width: 100%;
            height: 2rem;
            font-weight: 600;
            font-size: 1.2rem;
            text-align: start;
          }
          .Footer-section-item {
            width: 100%;
            height: 2rem;
            font-weight: 400;
            text-align: start;
            opacity: 1;

            color: inherit;
            text-decoration: none;
          }
          .Footer-section-item-link {
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  .Footer-credit {
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
