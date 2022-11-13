<script>
   const TimeGetter = {
      lastNowTime: 0,
      getTimeNow() {
         let timeNow = Date.now();
         while (timeNow <= this.lastNowTime) timeNow++;
         this.lastNowTime = timeNow;
         return timeNow;
      },
   };

   const getNewBelongingTemplate = () => ({
      title: "",
      quantity: 0,
      time: TimeGetter.getTimeNow(),
   });
   const isBelongingEmpty = (data) => data.title.trim() === "" && data.quantity <= 0;

   import Input from "@/components/Input.vue";

   export default {
      components: { Input },
      props: {
         values: { type: Array, default: () => [] },
      },
      data() {
         return { belongings: [] };
      },
      watch: {
         values() {
            this.onReset();
         },
      },
      methods: {
         onReset() {
            const values = (Array.isArray(this.values) ? this.values : []).map(
               (value) => {
                  return {
                     title: value.title,
                     quantity: value.quantity > 0 ? value.quantity : 1,
                     time: TimeGetter.getTimeNow(),
                  };
               }
            );

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
            return this.belongings.filter((belonging) => {
               if (belonging.time === 0) belonging.time = TimeGetter.getTimeNow();
               return belonging.title.trim() && belonging.quantity;
            });
         },
      },
      mounted() {
         this.onReset();
      },
   };
</script>

<template>
   <div class="BelongingListEdit-list">
      <div
         class="BelongingListEdit-item"
         v-for="belonging in belongings"
         :key="belonging.time"
      >
         <input
            class="BelongingListEdit-item-input"
            type="text"
            :label="`Item ${belongings.indexOf(belonging) + 1}`"
            :value="belonging.title"
            @input="
               (event) => {
                  let value = event.target.value.trim();
                  if (value === '') belonging.quantity = 0;
                  else
                     belonging.quantity = belonging.quantity > 0 ? belonging.quantity : 1;

                  belonging.title = value;

                  onInput();
               }
            "
            @change="
               (event) => {
                  let value = event.target.value.trim();
                  if (value === '') belonging.quantity = 0;
                  else
                     belonging.quantity = belonging.quantity > 0 ? belonging.quantity : 1;

                  onInput();
               }
            "
         />

         <div class="BelongingListEdit-item-quantity-controller">
            <div
               class="BelongingListEdit-item-minus BelongingListEdit-item-quantity-control-button"
               @click="
                  () => {
                     if (belonging.title.trim() === '') return;
                     belonging.quantity--;

                     if (belonging.quantity < 0) belonging.quantity = 0;
                     else if (belonging.quantity === 0) belonging.title = '';

                     onInput();
                  }
               "
            >
               <img
                  class="BelongingListEdit-item-quantity-control-button-icon"
                  :src="host.res('page/service/belonging-minus-color.svg')"
               />
            </div>
            <span class="BelongingListEdit-item-quantity"
               >x {{ belonging.quantity }}</span
            >
            <div
               class="BelongingListEdit-item-plus BelongingListEdit-item-quantity-control-button"
               @click="
                  () => {
                     if (belonging.title.trim() === '') return;
                     belonging.quantity++;
                     if (belonging.quantity > 999) belonging.quantity = 999;
                     onInput();
                  }
               "
            >
               <img
                  class="BelongingListEdit-item-quantity-control-button-icon"
                  :src="host.res('page/service/belonging-plus-color.svg')"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .BelongingListEdit-list {
      display: flex;
      flex-direction: column;
      row-gap: 0.4rem;
      .BelongingListEdit-item {
         display: flex;
         flex-direction: row;
         flex-wrap: wrap;
         align-items: center;
         justify-content: center;
         column-gap: 1rem;
         row-gap: 0.4rem;
         border: 1px solid hsl(0, 0%, 90%);
         border-radius: 4px;
         padding: 10px;

         .BelongingListEdit-item-input {
            width: max-content;
            max-width: 100%;
            flex-grow: 1;
            background: hsla(0, 0%, 0%, 0.03);
            padding: 0.6rem 0.4rem;
            transition: var(--animation-duration);

            padding: inherit;

            z-index: 2;
            width: 100%;
            border: none;
            border-bottom: 0.1em solid var(--primary-color);
            border-radius: 0.2em;

            font-weight: 400;
            font-size: 1em;
            color: black;
            transition: var(--animation-duration);
         }

         .BelongingListEdit-item-quantity-controller {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            flex-grow: 0;
            align-items: center;

            .BelongingListEdit-item-quantity-control-button {
               --quantity-controller-color: hsl(0, 0%, 50%);
               --size: 2rem;

               width: var(--size);
               height: var(--size);
               display: flex;
               border: 0.15rem solid var(--quantity-controller-color);
               border-radius: 0.4rem;
               padding: 4%;
               background-color: transparent;
               transition: var(--animation-duration);
               cursor: pointer;
               &:hover {
                  background-color: hsl(0, 0%, 90%);
               }
               &-icon {
                  min-width: 100%;
                  min-height: 100%;
                  max-width: 100%;
                  max-height: 100%;
               }
            } //abstract

            .BelongingListEdit-item-minus {
               --quantity-controller-color: hsl(11, 71%, 51%);
            }
            .BelongingListEdit-item-quantity {
               min-width: 3rem;
               text-align: center;
            }
            .BelongingListEdit-item-plus {
               --quantity-controller-color: hsl(163, 65%, 41%);
            }
         }
      }
   }
</style>
