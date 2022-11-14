<script>
   import ButtonIconText from "@/components/button/ButtonIconText.vue";
   import ItemCollection from "./ItemCollection.vue";

   export default {
      components: { ButtonIconText, ItemCollection },
      props: {
         database: { type: Object, default: null },
      },
      data() {
         return { isSelfExpand: false, expands: [] };
      },
      computed: {
         collections: (c) => c.database.collections,
         areExpanded: (c) => c.expands.length >= c.collections.length,
         areCollapsed: (c) => c.expands.length === 0,
      },
      methods: {
         addExpand(name) {
            this.expands.push(name);
         },
         removeExpand(name) {
            this.expands.splice(this.expands.indexOf(name), 1);
         },

         allExpand() {
            this.expands = this.collections.map((collection) => collection.name);
         },
         allCollapse() {
            this.expands = [];
         },

         pushDownloadDatabase() {
            this.databaseStore
               .dispatch("exportDatabase", { database: this.database.name })
               .then((databaseContext) => {
                  let { filename, data } = databaseContext;
                  let dataString = JSON.stringify(data, null, 0);
                  this.$root.pushDownload(filename, dataString);
               });
         },
      },
   };
</script>

<template>
   <div class="ItemDatabase">
      <div class="ItemDatabase-header">
         <span class="ItemDatabase-title">{{ database.name }}</span>

         <ButtonIconText
            :src="host.res('page/database/download-black.svg')"
            text="Export"
            @click="pushDownloadDatabase()"
         />

         <ButtonIconText
            :src="
               isSelfExpand
                  ? host.res('page/database/minus-black.svg')
                  : host.res('page/database/plus-black.svg')
            "
            :text="isSelfExpand ? 'Collapse' : 'Expand'"
            @click="
               if (isSelfExpand) {
                  isSelfExpand = false;
                  allCollapse();
               } else {
                  isSelfExpand = true;
                  allCollapse();
               }
            "
         />
      </div>

      <div class="ItemDatabase-body" v-if="isSelfExpand">
         <ItemCollection
            v-for="collection in collections"
            :key="collection.name"
            :collection="collection"
            :isExpand="expands.includes(collection.name)"
            @click-expand="
               if (expands.includes(collection.name)) removeExpand(collection.name);
               else addExpand(collection.name);
            "
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemDatabase {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      .ItemDatabase-header {
         width: 100%;
         display: flex;
         flex-direction: row;
         align-items: center;
         gap: 1rem;
         .ItemDatabase-title {
            flex-grow: 1;
            font-size: 1rem;
            color: black;
         }
      }
      .ItemDatabase-body {
         padding-left: 1rem;
         width: 100%;
         display: flex;
         flex-direction: column;
         gap: 1rem;

         background: hsla(0, 0%, 0%, 0.025);
         border-left: 2px solid hsla(0, 0%, 0%, 0.2);
         border-radius: 0.2rem;
         padding: 1rem;
         padding-right: 0.4rem;
      }
   }
</style>