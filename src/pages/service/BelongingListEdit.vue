<script>
   import Input from "@/components/Input.vue";
   import U from "@/U";
   import BelongingListEditItem from "./BelongingListEdit-Item.vue";
   import ServiceBelonging from "@/items/ServiceBelonging";

   const TimeGetter = {
      lastNowTime: 0,
      getTimeNow() {
         let timeNow = Date.now();
         while (timeNow <= this.lastNowTime) timeNow++;
         this.lastNowTime = timeNow;
         return timeNow;
      },
   };

   const getNewBelongingTemplate = () => {
      const data = new ServiceBelonging().toData();
      data.quantity = 0;
      data.time = TimeGetter.getTimeNow();

      return data;
   };
   const isBelongingEmpty = (data) =>
      data.title.trim() === "" && data.quantity <= 0;

   export default {
      components: { Input, BelongingListEditItem },
      props: { values: { type: Array, default: () => [] } },
      data: (c) => ({ belongings: [] }),
      watch: {
         values() {
            this.onReset();
         },
      },
      mounted() {
         this.onReset();
      },
      methods: {
         onReset() {
            const values = U.optArray(this.values).map((value) => {
               const data = new ServiceBelonging(this.stores)
                  .fromData(value)
                  .toData();
               data.time = TimeGetter.getTimeNow();

               return data;
            });

            this.belongings = [...values, getNewBelongingTemplate()];
         },

         onInput() {
            let emptyBelongings = this.belongings.filter((belonging) => {
               return isBelongingEmpty(belonging);
            });

            if (emptyBelongings.length === 0) {
               this.belongings.push(getNewBelongingTemplate());
            } else if (emptyBelongings.length === 1) {
            } else {
               while (emptyBelongings.length > 1) {
                  let remove = emptyBelongings.pop();
                  let indexRemove = this.belongings.indexOf(remove);
                  if (indexRemove !== this.belongings.length - 1) {
                     this.belongings.splice(this.belongings.indexOf(remove), 1);
                  }
               }
            }

            const last = this.belongings[this.belongings.length - 1];
            if (!isBelongingEmpty(last)) {
               this.belongings.push(getNewBelongingTemplate());
            }
         },

         getResults() {
            const results = this.belongings.filter((belonging) => {
               if (belonging.time === 0)
                  belonging.time = TimeGetter.getTimeNow();

               return belonging.title.trim() && belonging.quantity;
            });

            return results;
         },

         focus() {},
      },
   };
</script>

<template>
   <div class="BelongingListEdit-list">
      <BelongingListEditItem
         v-for="belonging in belongings"
         :key="belonging.time"
         :belongings="belongings"
         :belonging="belonging"
         @invalidate="() => onInput()"
      />
   </div>
</template>

<style lang="scss" scoped>
   .BelongingListEdit-list {
      display: flex;
      flex-direction: column;
      row-gap: 0.4rem;
      gap: 0.2rem;
   }
</style>
