<script>
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import GlobalSearch from "@/app/search/GlobalSearch.vue";
  import Setting from "@/items/Setting";
  import { format, differenceInMinutes } from "date-fns";

  export default {
    components: { NavigationBar, GlobalSearch },
    props: {
      isThin: { type: Boolean, default: false },
      isParentScrolledUp: { type: Boolean, default: true },
    },
    data: (c) => ({
      companyTitle: "",
      companyCategory: "",
      addressHref: "",
      days: [],
    }),
    computed: {
      businessHourDescription: (c) => {
        const now = new Date();

        const today = c.days.find((day) => day.isToday());

        if (!today) return "";

        const todayHourEnd = today.hours.getDateEnd();

        const remainingHourCount = differenceInMinutes(todayHourEnd, now);

        if (0 < remainingHourCount && remainingHourCount <= 30)
          return `Closing Soon until ${format(todayHourEnd, "h:mmaaa")}`;

        if (today.hours.isBetween(now))
          return `We're open until ${format(todayHourEnd, "h:mmaaa")}`;

        if (today.isSameDay(now) && today.hours.isBefore(now)) {
          const todayHourStart = today.hours.getDateStart();
          return `Sorry, we're not open now\nCome back at ${format(
            todayHourStart,
            "h:mmaaa",
          )}`;
        }

        const nextDay = today.getNextWorkingDay();
        const nextDayStartDate = nextDay.hours.getDateStart();
        return `Sorry, we're closed\nCome back at ${format(
          nextDayStartDate,
          "h:mmaaa",
        )} tomorrow`;
      },

      isNavigationDrawer() {
        return this.$store.getters.navigation.isDrawer();
      },

      screenWidth() {
        return this.$store.getters.window.innerWidth;
      },
    },
    watch: {
      "settingStore.getters.lastModified"() {
        this.invalidate();
      },
    },
    methods: {
      async invalidate() {
        this.companyTitle = await this.settingStore.dispatch("findValueOfKey", {
          key: Setting.Key.CompanyName,
          default: "",
        });
        this.companyCategory = await this.settingStore.dispatch(
          "findValueOfKey",
          { key: Setting.Key.CompanyCategory, default: "" },
        );
        this.addressHref = await this.settingStore.dispatch("findValueOfKey", {
          key: Setting.Key.LocationLink,
          default: "",
        });

        this.days = await this.settingStore.dispatch("findValueOfKey", {
          key: Setting.Key.CompanyWorkingHours,
          default: [],
        });
      },
    },
    mounted() {
      this.invalidate();
    },
  };
</script>

<template>
  <NavigationBar
    class="HomeActionbar"
    :icon-theme="isParentScrolledUp ? 'white' : 'black'"
    :isParentScrolledUp="`${isParentScrolledUp}`"
    :isNavigationDrawer="`${isNavigationDrawer}`"
    :isWide="`${screenWidth > 560}`"
  >
    <div class="HomeActionbar-body">
      <div class="HomeActionbar-title">
        <img
          v-if="isNavigationDrawer"
          class="HomeActionbar-logo"
          :style="{ 'grid-area': 'logo' }"
          :src="
            host.cloudinary({
              url: 'logo/svg/freshnet-enterprise-logo.svg',
            })
          "
          alt="Freshnet Enterprise Logo"
        />

        <span class="HomeActionbar-name" :style="{ 'grid-area': 'name' }">{{
          companyTitle
        }}</span>
        <a
          class="HomeActionbar-classification"
          :style="{ 'grid-area': 'category' }"
          v-if="addressHref.length"
          :href="addressHref"
          target="_blank"
          >{{ companyCategory }}</a
        >
        <p
          class="HomeActionbar-classification"
          :style="{ 'grid-area': 'category' }"
          v-else
          >{{ companyCategory }}</p
        >
      </div>

      <GlobalSearch
        :class="[
          'Home-actionbar-search',
          isThin
            ? 'Home-actionbar-search-isThin'
            : 'Home-actionbar-search-isWide',
        ]"
      />
    </div>
  </NavigationBar>
</template>

<style lang="scss" scoped>
  .HomeActionbar {
    --primary-color: #1673e1;
    --height: max-content;

    width: 100%;
    position: sticky;
    top: 0;

    width: 100%;

    .HomeActionbar-body {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .HomeActionbar-title {
        min-width: max-content;
        padding: 0.5rem;

        --logo-size: 2rem;

        gap: 0 0.5rem;

        display: grid;
        grid-template-rows: fit-content fit-content;
        grid-template-columns: var(--logo-size) 1fr;
        grid-template-areas:
          "logo name"
          "logo category";

        .HomeActionbar-logo {
          width: var(--logo-size);
          height: var(--logo-size);
        }
        .HomeActionbar-name {
          font-weight: 600;
          line-height: 1em;
          align-self: flex-end;
        }
        .HomeActionbar-classification {
          font-size: 0.7em;
          color: inherit;
          text-decoration: inherit;
          align-self: flex-start;
        }
        a.HomeActionbar-classification {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .Home-actionbar-search {
        --background-color: hsla(0, 0%, 100%, 0.9);
        --border: 1px solid black;
      }

      .Home-actionbar-search-isThin {
        margin-left: 1rem;
      }
      .Home-actionbar-search-isWide {
        margin-left: -0.7rem;
      }
    }
  }

  .HomeActionbar[isWide="true"] {
    .Home-actionbar-search {
      max-width: 22rem;
    }
  }

  .HomeActionbar[isParentScrolledUp="true"] {
    background: transparent;
    border-bottom: transparent;
    color: white;
    .Home-actionbar-search {
      --border: 1px solid transparent;
    }
  }
  .HomeActionbar[isParentScrolledUp="false"] {
    background: white;
    border-bottom: 1px solid #0000001a;
    box-shadow: 0 0 1em #0000001a;
    color: black;
    .Home-actionbar-search {
      --border: 1px solid hsla(0, 0%, 0%, 0.2);
    }
  }

  .HomeActionbar[isNavigationDrawer="true"] {
    .HomeActionbar-title {
      grid-template-rows: fit-content fit-content;
      grid-template-columns: var(--logo-size) 1fr;
      grid-template-areas:
        "logo name"
        "logo category";
    }
  }
  .HomeActionbar[isNavigationDrawer="false"] {
    .HomeActionbar-title {
      grid-template-rows: fit-content fit-content;
      grid-template-columns: 1fr;
      grid-template-areas:
        "name"
        "category";
    }
  }
</style>
