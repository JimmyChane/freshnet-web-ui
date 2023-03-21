<script>
   import Searchbar from "./Searchbar.vue";

   export default {
      components: { Searchbar },
      props: {
         list: { type: Array, default: () => [] },
         placeholder: { type: String, default: "Search" },
      },
      data: (c) => ({ search: "", isExpand: false, searchLastCharTime: 0 }),
      watch: {
         search(text = "") {
            this.isExpand = text.length > 0;

            const elapseTimeDesigned = 250;
            const date = new Date();
            const time = date.getTime();

            if (time < this.searchLastCharTime) return;

            this.searchLastCharTime = time;
            setTimeout(() => this.$emit("callback-search", text), elapseTimeDesigned);
         },
         isExpand() {
            this.isExpand ? this.$emit("expand") : this.$emit("collapse");
         },
      },
      emits: ["callback-search"],
      methods: {
         clear() {
            this.search = "";
         },
         expand() {
            this.isExpand = true;
         },
         collapse() {
            setTimeout(() => {
               this.isExpand = false;
            }, 300);
         },

         focus() {
            this.$refs.searchbar.focus();
         },
      },
   };
</script>

<template>
   <div class="SearchInput">
      <Searchbar
         ref="searchbar"
         :class="[isExpand ? 'SearchInput-body-isActive' : 'SearchInput-body-isPassive']"
         :model="search"
         :placeholder="placeholder"
         @clear="(e) => clear()"
         @input="(e) => (search = e.value)"
         @blur="() => collapse()"
      />

      <div
         class="SearchInput-background transition"
         :style="{
            opacity: [isExpand ? '1' : '0'],
            'pointer-events': [isExpand ? 'all' : 'none'],
         }"
         @click="() => collapse()"
      />

      <div class="SearchInput-dropdown" v-if="isExpand">
         <div class="SearchInput-dropdown-body">
            <p v-if="!list || list.length <= 0">No Result</p>

            <slot
               :clear="() => clear()"
               :expand="() => expand()"
               :collapse="() => collapse()"
               :list="list"
            />
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .SearchInput {
      --background-color: hsla(0, 0%, 100%, 0.3);
      --background-color-active: white;
      --background-color-focus: white;

      --border-radius: 0.4rem;
      --border-radius-active: 0.4rem;

      --border: 1px solid hsla(0, 0%, 0%, 0.15);
      --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);

      --dropdown-height: 80vh;

      background-color: #e4e4e4;

      border-radius: var(--border-radius);

      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      height: 100%;
      position: relative;

      background-color: #e4e4e4;

      .SearchInput-body-isPassive {
         border: var(--border);
         background-color: var(--background-color);
         border-radius: var(--border-radius);
         &:focus-within {
            background-color: var(--background-color-focus);
            border: var(--border-focus);
         }
      }
      .SearchInput-body-isActive {
         background-color: var(--background-color-active);
         border-radius: var(--border-radius-active) var(--border-radius-active) 0 0;
         &:focus-within {
            background-color: var(--background-color-active);
            border: var(--border-active);
         }
      }

      .SearchInput-background {
         min-width: 100dvw;
         min-height: 100dvh;
         position: fixed;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         background-color: hsla(0, 0%, 0%, 0.6);
         display: grid;
      }

      .SearchInput-dropdown {
         width: 100%;
         height: 100dvh;
         max-height: var(--dropdown-height);

         z-index: 1;

         position: absolute;
         top: 100%;

         box-shadow: 0 0 60px hsla(0, 0%, 0%, 0.1);
         border-radius: 0 0 var(--border-radius-active) var(--border-radius-active);

         background-color: #e4e4e4;
         overflow: hidden;

         .SearchInput-dropdown-body {
            width: 100%;
            height: 100%;
            max-height: var(--dropdown-height);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;

            border-radius: 0 0 var(--border-radius-active) var(--border-radius-active);

            overflow-y: auto;
            overflow-x: hidden;

            padding: 0.7rem 0.9rem 4rem 0.9rem;
            color: black;

            & > * {
               width: 100%;
               height: max-content;
               overflow: initial;
            }
         }
      }
   }
</style>
