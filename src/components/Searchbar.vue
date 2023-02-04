<script>
   import Host from "@/host/ApiHost";
   import ButtonIcon from "@/components/button/ButtonIcon.vue";

   export default {
      components: { ButtonIcon },
      props: {
         placeholder: { type: String, default: "Search" },
         model: { default: undefined },
         backIcon: { type: String, default: Host.res("icon/close-000000.svg") },
         enterIcon: {
            type: String,
            default: Host.res("icon/search-000000.svg"),
         },
      },
      data() {
         return { search: "" };
      },
      computed: {
         value: {
            get() {
               return this.search;
            },
            set(value) {
               this.search = value;
            },
         },

         icon: (c) => (c.search ? c.backIcon : c.enterIcon),
      },
      watch: {
         model() {
            this.search = this.model;
         },
      },
      methods: {
         blur() {
            this.$refs["input"].blur();
         },
         focus() {
            this.$refs["input"].focus();
         },
         enter() {
            this.focus();
            this.$emit("enter");
         },
         clear() {
            this.search = "";
            this.focus();
            this.$emit("clear", this._self);
         },
      },
   };
</script>

<template>
   <div :class="['Searchbar', 'transition']" @click="() => focus()">
      <ButtonIcon
         class="Searchbar-icon"
         :src="icon"
         :alt="search ? 'Clear' : 'Search'"
         @click="() => (search.length > 0 ? clear() : enter())"
      />
      <input
         class="Searchbar-input transition"
         ref="input"
         v-model="search"
         :placeholder="placeholder"
         @focus="(e) => $emit('focus', this._self)"
         @blur="(e) => $emit('blur', this._self)"
         @input="
            (e) => {
               search = e.target.value;
               $emit('input', this._self);
            }
         "
         @change="(e) => $emit('change', this._self)"
      />
   </div>
</template>

<style lang="scss" scoped>
   .Searchbar {
      z-index: 2;
      width: 100%;
      height: 100%;
      padding: 0.2em;
      border-radius: 2em;
      gap: 0.1em;

      color: #5c5c5c;

      display: flex;
      flex-direction: row;
      align-items: center;

      .Searchbar-icon {
         font-size: 0.9em;
      }
      .Searchbar-input {
         width: 100%;
         font-size: 1em;
         flex-grow: 1;
         border: none;
         outline: none;
         border: none;
         background: none;
         display: flex;
         flex-direction: row;
         &::placeholder {
            color: hsla(0, 0%, 0%, 0.4);
            font-size: 0.8em;
         }
      }

      background-color: hsla(0, 0%, 90%, 0.96);
      border: 1px solid hsla(0, 0%, 0%, 0.15);
      &:focus-within {
         background-color: white;
         border: 1px solid hsla(0, 0%, 0%, 0.15);
      }
   }
</style>
