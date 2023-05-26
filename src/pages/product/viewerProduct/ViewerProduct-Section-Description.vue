<script>
   import Section from "./ViewerProduct-Section.vue";

   export default {
      components: { Section },
      props: {
         primaryColor: { type: Object },
         allowEdit: { type: Boolean, default: false },
         product: { type: Object, default: () => null },
      },
      computed: {
         description: (c) => c.product?.description ?? "",

         menu() {
            if (!this.allowEdit) return null;
            return {
               title: "Edit",
               icon: this.host.icon("edit-000000"),
               click: () =>
                  this.$emit("click-edit", {
                     product: this.product,
                     description: this.description,
                  }),
            };
         },
      },
   };
</script>

<template>
   <Section
      class="SectionDescription-parent"
      v-if="allowEdit || description"
      :title="allowEdit ? 'Description' : ''"
      :primaryColor="primaryColor"
      :menu="menu"
   >
      <div class="SectionDescription">
         <p v-if="description">{{ description }}</p>
         <span class="SectionDescription-noContent" v-else>No Description</span>
      </div>
   </Section>
</template>

<style lang="scss" scoped>
   .SectionDescription-parent {
      grid-area: description;
      .SectionDescription {
         width: 100%;
         font-size: 1rem;

         background: hsla(0, 0%, 100%, 0.6);
         padding: 1.2rem;
         font-size: 1rem;
         .SectionDescription-noContent {
            opacity: 0.6;
            font-style: italic;
            font-size: 1rem;
         }
      }
   }
</style>
