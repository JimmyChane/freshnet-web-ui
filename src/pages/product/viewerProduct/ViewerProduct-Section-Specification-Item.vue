<script>
   export default {
      props: {
         productSpecification: { type: Object, default: () => null },
         isVertical: { type: Boolean, default: false },
      },
      data: (c) => ({ title: "", icon: "", content: "" }),
      watch: {
         productSpecification() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            this.title = "";
            this.icon = "";
            this.content = "";

            const type = this.productSpecification
               ? await this.productSpecification.fetchType()
               : null;

            this.title = type
               ? type.title
               : this.parseKeyToTitle(this.productSpecification.typeKey);
            this.icon = type && type.icon ? type.icon.toUrl() : "";
            this.content = this.productSpecification.content;
         },
         parseKeyToTitle(key = "") {
            if (typeof key !== "string") key = "none";
            if (key === "none") return "";

            return key.split(" ").reduce((title, text) => {
               let result = text.charAt(0).toUpperCase() + text.slice(1);
               return title === "" ? result : `${title} ${result}`;
            }, "");
         },
      },
   };
</script>

<template>
   <div
      :class="[
         'ItemProductSpecification',
         isVertical
            ? 'ItemProductSpecification-isVertical'
            : 'ItemProductSpecification-isHorizontal',
      ]"
   >
      <img
         class="ItemProductSpecification-icon"
         :style="{ opacity: icon ? '1' : '0' }"
         :src="icon"
      />
      <div class="ItemProductSpecification-main">
         <span class="ItemProductSpecification-title">{{ title }}</span>
         <span class="ItemProductSpecification-content">{{ content }}</span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ItemProductSpecification {
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: row;
      padding: 1.2rem;
      background: hsla(0, 0%, 100%, 0.6);

      .ItemProductSpecification-icon {
         width: 1.6rem;
         height: 1.6rem;
         padding: 0.2rem;
         object-fit: contain;
      }
      .ItemProductSpecification-main {
         width: 100%;
         flex-grow: 1;
         display: flex;
         align-items: flex-start;
         justify-content: flex-start;
         .ItemProductSpecification-title {
            height: max-content;

            display: flex;
            flex-direction: row;
            align-items: center;
            font-weight: 400;
            font-size: 0.7rem;
         }
         .ItemProductSpecification-content {
            height: max-content;
            min-height: 1.6rem;

            font-weight: 600;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
         }
      }
   }

   .ItemProductSpecification-isVertical {
      gap: 1.2rem;
      .ItemProductSpecification-main {
         flex-direction: column;
         min-height: 2rem;
      }
   }
   .ItemProductSpecification-isHorizontal {
      gap: 0;

      .ItemProductSpecification-main {
         width: 100%;
         flex-grow: 1;
         flex-direction: row;
         min-height: 1.6rem;

         .ItemProductSpecification-title {
            min-height: 1.6rem;
            min-width: 5rem;
            max-width: 5rem;
            padding: 0 0.6rem;
         }
         .ItemProductSpecification-content {
            width: 100%;
         }
      }
   }
</style>
