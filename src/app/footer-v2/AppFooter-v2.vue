<script setup lang="ts">
import { ref } from 'vue';

import { APP_VERSION } from '@/config';
import { BEH_AIK_KEONG_CONTACT, OFFICE_CONTACT, OFFICE_MOBILE_CONTACT } from '@/entity/model-v2/Contact.model';

import ContactVue from './Footer-Contact.vue';

const contacts = ref([BEH_AIK_KEONG_CONTACT, OFFICE_MOBILE_CONTACT, OFFICE_CONTACT]);
</script>

<template>
  <div class="Footer">
    <div class="Footer-main">
      <div class="Footer-rows">
        <div class="Footer-columns">
          <div class="Footer-section">
            <span class="Footer-section-title">Service</span>

            <span class="Footer-section-item">Photostat &amp; Printing</span>
          </div>
        </div>

        <div class="Footer-columns">
          <div class="Footer-section">
            <span class="Footer-section-title">Contacts</span>

            <ContactVue v-for="contact of contacts" :key="contact.subtitle" :contact="contact" />
          </div>
        </div>

        <div class="Footer-columns">
          <div class="Footer-section">
            <span class="Footer-section-title">Location</span>

            <a
              :class="['Footer-section-item', 'Footer-section-item-link']"
              href="https://www.google.com/maps/dir//No.+14,+Ground+Floor,+Freshnet+Enterprise,+Jalan+Melati+3%2F3,+Bandar+Melawati,+45000+Kuala+Selangor,+Selangor/@3.329664,101.256548,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31ccf49e980c2d07:0xadf4850c7c433d0a!2m2!1d101.2565481!2d3.3296638"
              target="_blank"
            >
              <p>
                No. 14, Ground Floor, Jalan Melati 3/3,
                <br />
                Bandar Melawati, 45000,
                <br />
                Kuala Selangor, Selangor Darul Ehsan
              </p>
            </a>
          </div>
        </div>
      </div>

      <span class="footer-version">v{{ APP_VERSION }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Footer {
  --primary-color: hsl(0, 0%, 20%);

  width: 100%;
  margin-top: 4rem;
  padding: 2rem;
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
}
</style>
