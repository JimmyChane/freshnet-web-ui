<script lang="ts">
  import Section from "./PageHome-Section.vue";
  import Setting from "@/items/Setting";

  import { getHours } from "date-fns";
  import Vue from "vue";

  export default Vue.extend({
    components: { Section },
    data() {
      return { companyTitle: "", companyCategory: "", addressHref: "" };
    },
    computed: {
      greetTitle() {
        const periods = [
          { title: "Good Midnight", start: 0, end: 4 },
          { title: "Good Dawn", start: 5, end: 6 },
          { title: "Good Morning", start: 7, end: 11 },
          { title: "Good Afternoon", start: 12, end: 15 },
          { title: "Good Evening", start: 16, end: 18 },
          { title: "Good Night", start: 19, end: 23 },
        ];

        const hour = getHours(Date.now());

        const period = periods.find((period) => {
          return period.start <= hour && hour <= period.end;
        });

        return period ? period.title : "Hi";
      },
    },
    watch: {
      "$store.state.stores.setting.getters.lastModified"() {
        this.invalidate();
      },
    },
    mounted() {
      this.invalidate();
    },
    methods: {
      async invalidate() {
        this.companyTitle = await this.$store.state.stores.setting.dispatch(
          "findValueOfKey",
          { key: Setting.Key.CompanyName, default: "" },
        );
        this.companyCategory = await this.$store.state.stores.setting.dispatch(
          "findValueOfKey",
          { key: Setting.Key.CompanyCategory, default: "" },
        );
        this.addressHref = await this.$store.state.stores.setting.dispatch(
          "findValueOfKey",
          { key: Setting.Key.LocationLink, default: "" },
        );
      },
    },
  });
</script>

<template>
  <Section>
    <div class="HomeHeader">
      <div class="HomeHeader-greet">
        <span class="HomeHeader-greetTitle">{{ greetTitle }}</span>
        <span class="HomeHeader-greetHelp">How can we help you?</span>
      </div>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
  .HomeHeader {
    column-gap: 1em;
    row-gap: 0.4em;
    color: white;
    text-align: center;

    z-index: 2;
    width: 100%;

    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;

    font-size: 1rem;

    .HomeHeader-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2em;

      .HomeHeader-name {
        font-weight: 600;
        font-size: 1.5em;
        line-height: 1em;
      }
      .HomeHeader-classification {
        font-size: 0.4em;
        color: inherit;
        text-decoration: inherit;
      }
      .HomeHeader-classification-a {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .HomeHeader-description {
      font-size: 1em;
      line-height: 1em;
    }
    .HomeHeader-greet {
      --height: 6rem;
      min-height: var(--height);
      max-height: var(--height);

      display: flex;
      flex-direction: column;
      align-items: center;
      align-items: inherit;
      justify-content: inherit;

      font-size: 0.6em;
      font-weight: 600;
    }

    @media (min-width: 320px) {
      font-size: 1.1rem;
    }
    @media (min-width: 340px) {
      font-size: 1.2rem;
    }
    @media (min-width: 350px) {
      font-size: 1.3rem;
    }
    @media (min-width: 380px) {
      font-size: 1.4rem;
    }
    @media (min-width: 480px) {
      font-size: 1.8rem;
    }
    @media (min-width: 500px) {
      font-size: 1.9rem;
    }
  }
</style>
