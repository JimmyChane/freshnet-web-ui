<script>
   import Company from "@/host/Company";

   export default {
      props: {
         product: { type: Object, default: () => null },
         isWide: { type: Boolean, default: false },
      },
      data() {
         return {
            whatsappLink: "",

            callTypeTitle: "",
            callTitle: "",
            callHref: "",
            callTarget: "",
            callIcon: "",

            whatsappTypeTitle: "",
            whatsappTitle: "",
            whatsappHref: "",
            whatsappTarget: "",
            whatsappIcon: "",
         };
      },
      watch: {
         product() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            const contact = Company.Contacts.findByTitle("Beh Aik Keong");

            const contactCall = contact.links.find(
               (link) => link.category.title === "Call",
            );
            this.callTypeTitle = contactCall.category.title;
            this.callTitle = contact.title;
            this.callHref = contactCall.toHtmlHref();
            this.callTarget = contactCall.toHtmlTarget();
            this.callIcon = contactCall.category.icon;

            const contactWhatsapp = contact.links.find(
               (link) => link.category.title === "Whatsapp",
            );
            this.whatsappTypeTitle = contactWhatsapp.category.title;
            this.whatsappTitle = contact.title;
            this.whatsappTarget = contactWhatsapp.toHtmlTarget();
            this.whatsappIcon = contactWhatsapp.category.icon;

            let { product } = this;
            if (!product) {
               this.whatsappHref = contactWhatsapp.toHtmlHref();
               return;
            }

            const productLink = this.product.getLink();
            const title = await product.fetchFullTitle();

            let text = `Hi, I am interested in this product`;
            if (title) text += `\n\n${title}`;
            if (productLink) text += `\n${productLink}`;
            const textUri = encodeURIComponent(text);

            this.whatsappHref = `${contactWhatsapp.toHtmlHref()}&text=${textUri}`;
         },
      },
   };
</script>

<template>
   <div class="ViewerProduct-BottomActionbar">
      <div class="ViewerProduct-BottomActionbar-main">
         <a
            class="ViewerProduct-BottomActionbar-item"
            :href="callHref"
            :style="{
               '--primary-color': '#2196f3',
               '--primary-background-color': '#dff1ff',
            }"
         >
            <img class="ViewerProduct-BottomActionbar-item-icon" :src="callIcon" />
            <div class="ViewerProduct-BottomActionbar-item-body">
               <span class="ViewerProduct-BottomActionbar-item-title">{{
                  callTypeTitle
               }}</span>
               <span class="ViewerProduct-BottomActionbar-item-content">{{
                  callTitle
               }}</span>
            </div>
         </a>

         <a
            class="ViewerProduct-BottomActionbar-item"
            :target="whatsappTarget"
            :href="whatsappHref"
            :style="{
               '--primary-color': '#4caf50',
               '--primary-background-color': '#f3fff4',
            }"
         >
            <img class="ViewerProduct-BottomActionbar-item-icon" :src="whatsappIcon" />
            <div class="ViewerProduct-BottomActionbar-item-body">
               <span class="ViewerProduct-BottomActionbar-item-title">{{
                  whatsappTypeTitle
               }}</span>
               <span class="ViewerProduct-BottomActionbar-item-content">{{
                  whatsappTitle
               }}</span>
            </div>
         </a>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .ViewerProduct-BottomActionbar {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-evenly;

      position: sticky;
      bottom: 0;
      width: 100%;
      gap: 2rem;

      border-top: 1px solid hsla(0, 0%, 0%, 0.1);
      box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.1);

      .ViewerProduct-BottomActionbar-main {
         width: 100%;
         max-width: 24rem;
         display: flex;
         flex-direction: row;
         flex-wrap: nowrap;
         align-items: center;
         justify-content: center;
         justify-content: space-evenly;
         padding: 0.5rem 1rem;

         .ViewerProduct-BottomActionbar-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            border: none;
            cursor: pointer;
            border-radius: 0.5rem;
            overflow: hidden;
            transition: var(--transition-duration);

            text-decoration: none;
            color: var(--primary-color);
            font-size: 1rem;
            font-weight: 600;
            line-height: 0.9rem;
            gap: 0.5rem;
            padding: 0.3rem 0.5rem;

            &:hover {
               background-color: hsla(0, 0%, 100%, 0.8);
            }

            .ViewerProduct-BottomActionbar-item-icon {
               grid-area: icon;
               width: 1.2rem;
               height: 1.2rem;
            }
            .ViewerProduct-BottomActionbar-item-body {
               display: flex;
               flex-direction: column;
               align-items: flex-start;
               justify-content: center;
               .ViewerProduct-BottomActionbar-item-title {
                  grid-area: title;
                  display: flex;
                  align-items: center;
                  font-size: 0.9rem;
               }
               .ViewerProduct-BottomActionbar-item-content {
                  grid-area: content;
                  font-size: 0.8rem;
               }
            }
         }
      }
   }
</style>
