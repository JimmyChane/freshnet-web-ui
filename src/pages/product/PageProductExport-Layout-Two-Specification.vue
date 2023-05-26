<script>
   import U from "@/U";
   export default {
      props: {
         item: { type: Object },
         padding: { type: Number, default: 14 },
         isLastItem: { type: Boolean, default: false },
      },
      data: (c) => ({ title: "", icon: "", content: "" }),
      watch: {
         item() {
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

            const type = this.item ? await this.item.fetchType() : null;

            this.title = type?.title ?? this.parseKeyToTitle(this.item.typeKey);
            this.icon = type?.icon?.toUrl() ?? "";
            this.content = this.item.content;
         },
         parseKeyToTitle(key = "") {
            if (!U.isString(key)) key = "none";
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
      class="ItemProductSpecification"
      :style="{ padding: `${padding}px` }"
      :isLastItem="`${isLastItem}`"
   >
      <span class="ItemProductSpecification-title">{{ title }}</span>
      <span class="ItemProductSpecification-content">{{ content }}</span>
   </div>
</template>

<style lang="scss" scoped>
   .ItemProductSpecification {
      width: 100%;
      max-width: 100%;
      gap: 14px;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      --min-height: 20px;
      --font-size-title: 14px;
      --font-size-content: 18px;

      :nth-child(1) {
         line-height: var(--font-size-content);
         font-size: var(--font-size-title);

         --width: 120px;
         width: var(--width);
         min-width: var(--width);
         max-width: var(--width);
         min-height: var(--min-height);

         display: flex;
         flex-direction: row;
         align-items: center;
         color: hsl(0, 0%, 30%);
      }
      :nth-child(2) {
         font-size: var(--font-size-content);
         font-weight: 600;

         min-height: var(--min-height);

         display: flex;
         flex-direction: row;
         flex-grow: 1;
         align-items: center;
         justify-content: flex-start;
      }
   }
   .ItemProductSpecification[isLastItem="false"] {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
   }
</style>
