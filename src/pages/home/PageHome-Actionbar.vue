<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import GlobalSearch from "@/app/search/GlobalSearch.vue";
   import Setting from "@/items/data/Setting";
   import { format, differenceInMinutes } from "date-fns";

   export default {
      components: { NavigationBar, GlobalSearch },
      props: { isThin: { type: Boolean, default: false } },
      data: (c) => ({ days: [] }),
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
      },
      watch: {
         "settingStore.getters.lastModified"() {
            this.invalidate();
         },
      },
      methods: {
         async invalidate() {
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
   <div :class="['HomeActionbar']">
      <NavigationBar class="HomeActionbar-navigationBar">
         <div class="HomeActionbar-body">
            <GlobalSearch
               :class="[
                  'Home-actionbar-search transition',
                  isThin
                     ? 'Home-actionbar-search-isThin'
                     : 'Home-actionbar-search-isWide',
               ]"
            />
         </div>
      </NavigationBar>
      <p
         class="HomeActionbar-description"
         :class="[
            $root.window.innerWidth > 800
               ? 'HomeActionbar-description-isWide'
               : '',
         ]"
         v-if="businessHourDescription"
         >{{ businessHourDescription }}</p
      >
   </div>
</template>

<style lang="scss" scoped>
   .HomeActionbar {
      width: 100%;
      position: sticky;
      top: 0;
      background-color: hsl(0, 0%, 89%);
      border-bottom: 1px solid #0000001a;

      display: flex;
      flex-direction: column;
      align-items: center;

      .HomeActionbar-description {
         width: 100%;
         max-width: 70rem;
         font-size: 0.8rem;
         padding: 0.2rem 1.2rem;
         text-align: center;
      }
      .HomeActionbar-description-isWide {
         padding: 0.2rem 2rem;
      }

      .HomeActionbar-navigationBar {
         width: 100%;

         --height: max-content;
         background-color: inherit;
         border-bottom: 1px solid #0000001a;

         .HomeActionbar-body {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .Home-actionbar-search {
               max-width: 24rem;
               --background-color: hsla(0, 0%, 100%, 0.9);
            }
            .Home-actionbar-search-isThin {
               margin-left: 1rem;
            }
            .Home-actionbar-search-isWide {
               margin-left: -0.7rem;
            }
         }
      }
   }
</style>
