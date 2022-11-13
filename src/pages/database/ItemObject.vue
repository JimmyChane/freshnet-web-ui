<script>
   export default {
      name: "ItemObject",
      props: {
         item: { default: () => null },
      },
      computed: {
         itemKeys: (c) => c.keys(c.item),
      },
      methods: {
         shouldIncludeNextLine(item, key) {
            return (
               (this.isArray(item) && key < this.itemKeys.length - 1) ||
               (this.isObject(item) &&
                  this.itemKeys.indexOf(key) !== this.itemKeys.length - 1)
            );
         },

         keys(value) {
            return value !== undefined && value !== null ? Object.keys(value) : [];
         },
         isNull(value) {
            return value === null;
         },
         isArray(value) {
            return Array.isArray(value);
         },
         isObject(value) {
            return typeof value === "object";
         },
         isBoolean(value) {
            return typeof value === "boolean";
         },
         isNumber(value) {
            return typeof value === "number";
         },
         isString(value) {
            return typeof value === "string";
         },
      },
   };
</script>

<template>
   <div class="ItemObject">
      <span class="ItemObject-property" v-for="key in itemKeys" :key="key">
         <span class="ItemObject-key" v-if="!isArray(item)">"{{ key }}"</span>

         <span class="ItemObject-separator" v-if="!isArray(item)">:</span>

         <span class="ItemObject-value" v-if="isNull(item[key])">null</span>
         <span class="ItemObject-value" v-else-if="isArray(item[key])"
            >{{ "[" }}<ItemObject v-if="item[key].length" :item="item[key]" />{{
               "]"
            }}</span
         >
         <span class="ItemObject-value" v-else-if="isObject(item[key])"
            >{{ "{" }}<ItemObject v-if="itemKeys.length" :item="item[key]" />{{
               "}"
            }}</span
         >
         <span
            class="ItemObject-value"
            v-else-if="isBoolean(item[key]) || isNumber(item[key])"
            >{{ item[key] }}</span
         >
         <span class="ItemObject-value" v-else>{{ `"${item[key]}"` }}</span>

         <span class="ItemObject-nextLine">{{
            shouldIncludeNextLine(item, key) ? "," : ""
         }}</span>
      </span>
   </div>
</template>

<style lang="scss" scoped>
   .ItemObject {
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 0.2rem;

      // background: hsla(0, 0%, 0%, 0.025);
      border-left: 2px solid hsla(0, 0%, 0%, 0.2);
      border-radius: 0 0.4rem 0.4rem 0;
      padding: 0.2rem;

      .ItemObject-property {
         padding-left: 1rem;
         padding-right: 0.4rem;
         .ItemObject-key {
            --width: 8rem;
            min-width: var(--width);
            max-width: var(--width);
            font-size: 0.8rem;
            color: hsl(0, 0%, 30%);
            word-break: break-all;
            // display: inline-block;
         }
         .ItemObject-separator {
            padding-left: 0.5rem;
            padding-right: 1rem;
         }
         .ItemObject-value {
            font-size: 1rem;
            word-break: break-all;
         }
         .ItemObject-nextLine {
            padding-left: 0.5rem;
            padding-right: 1rem;
         }
      }
   }
</style>
