<script>
   import Company from "@/host/Company";
   import ButtonContact from "./BottomActionbar-ButtonContact.vue";
   import ButtonTop from "./BottomActionbar-ButtonTop.vue";

   export default {
      components: { ButtonContact, ButtonTop },
      props: {
         product: { type: Object, default: () => null },
         isWide: { type: Boolean, default: false },
         parentScrollTop: { type: Number, default: 0 },
      },
      data: (c) => ({
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
      }),
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
   <div
      class="ViewerProduct-BottomActionbar"
      :isButtonTopHidden="parentScrollTop <= 10"
   >
      <ButtonContact
         class="ViewerProduct-BottomActionbar-whatsapp"
         :target="whatsappTarget"
         :href="whatsappHref"
         :icon="whatsappIcon"
         :titleHeader="whatsappTypeTitle"
         :titleContent="whatsappTitle"
         primaryColorHex="#4caf50"
      />
      <ButtonContact
         class="ViewerProduct-BottomActionbar-call"
         :target="callTarget"
         :href="callHref"
         :icon="callIcon"
         :titleHeader="callTypeTitle"
         :titleContent="callTitle"
         primaryColorHex="#2196f3"
         :toShrink="true"
      />
      <ButtonTop
         :isHidden="parentScrollTop <= 10"
         @click="() => $emit('click-scrollToTop')"
      />
   </div>
</template>

<style lang="scss" scoped>
   .ViewerProduct-BottomActionbar {
      position: sticky;
      bottom: 0;
      width: 100%;
      gap: 0.3rem;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
      padding: 0.5rem 1rem;
      padding: 1rem;
   }
   .ViewerProduct-BottomActionbar[isButtonTopHidden="true"] {
      .ViewerProduct-BottomActionbar-whatsapp {
         transform: translateX(4.3rem);
      }
      .ViewerProduct-BottomActionbar-call {
         transform: translateX(4.3rem);
      }
   }
</style>
