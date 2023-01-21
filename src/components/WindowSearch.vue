<script>
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Actionbar from "@/components/actionbar/Actionbar.vue";

   export default {
      components: { PopupWindow, Actionbar },
      props: {
         isShowing: { type: Boolean, default: false },
         placeholder: { type: String, default: "Search" },
      },
      data() {
         return { search: "", results: [] };
      },
      watch: {
         isShowing() {
            this.isShowing
               ? this.$refs.inputSearch.focus()
               : this.$refs.inputSearch.blur();
         },
         search() {
            this.onInput();
         },
      },
      mounted() {
         this.onInput();
      },
      methods: {
         onInput() {
            this.$emit("input-text", this.search);
         },
      },
   };
</script>

<template>
   <PopupWindow
      class="WindowSearch"
      :isShowing="isShowing"
      @click-dismiss="() => $emit('click-dismiss')"
   >
      <div class="WindowSearch-body">
         <div class="WindowSearch-actionbar">
            <button
               class="WindowSearch-actionbar-close"
               @click="() => $emit('click-dismiss')"
            >
               <img :src="host.res('icon/arrow-left-000000.svg')" alt="" />
            </button>

            <input
               class="WindowSearch-input"
               ref="inputSearch"
               type="text"
               :placeholder="placeholder"
               v-model="search"
            />
         </div>

         <div class="WindowSearch-items"> <slot /> </div>
      </div>
   </PopupWindow>
</template>

<style lang="scss" scoped>
   .WindowSearch-body {
      width: 100vw;
      height: 100vh;
      max-width: 100%;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow-y: auto;
      position: relative;

      .WindowSearch-actionbar {
         z-index: 2;
         position: sticky;
         top: 0;
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: space-between;
         gap: 0.3rem;
         border-bottom: 1px solid hsl(0, 0%, 90%);
         background-color: white;
         padding: 0.5rem;
         .WindowSearch-actionbar-close {
            width: 2.5rem;
            height: 2.5rem;
            border: none;
            background: none;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: var(--transition-duration);
            cursor: pointer;
            &:hover {
               background-color: hsl(0, 0%, 90%);
            }
            img {
               width: 16px;
               height: 16px;
            }
         }
         .WindowSearch-input {
            flex-grow: 1;
            padding: 1rem;
            border: 1px solid hsla(0, 0%, 0%, 0.05);
            border-radius: 0.5rem;
            background-color: hsl(0, 0%, 90%);
            &::placeholder {
               color: hsl(0, 0%, 70%);
            }
         }
      }

      .WindowSearch-items {
         z-index: 1;
         width: 100%;
         display: flex;
         flex-direction: column;
         gap: 0.2rem;
         padding: 0.5rem;
      }
   }
</style>
