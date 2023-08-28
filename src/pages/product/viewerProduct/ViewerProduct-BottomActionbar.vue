<script>
   import ButtonContact from "./BottomActionbar-ButtonContact.vue";
   import ButtonTop from "./BottomActionbar-ButtonTop.vue";
   import Setting from "@/items/Setting";

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
         "$store.state.stores.setting.getters.lastModified"() {
            this.invalidate();
         },
         product() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         async invalidate() {
            const contacts = await this.$store.state.stores.setting.dispatch(
               "findValueOfKey",
               { key: Setting.Key.Contacts, default: [] },
            );
            const contact = this.findContactByTitle(contacts, "Beh Aik Keong");

            const contactCall =
               contact?.links.find((link) => link.category.title === "Call") ??
               null;
            const contactWhatsapp =
               contact?.links.find(
                  (link) => link.category.title === "Whatsapp",
               ) ?? null;

            this.callTypeTitle = contactCall?.category?.title ?? "";
            this.callTitle = contact?.title ?? "";
            this.callHref = contactCall?.toHtmlHref() ?? "";
            this.callTarget = contactCall?.toHtmlTarget() ?? "";
            this.callIcon = contactCall?.category?.icon ?? "";
            this.whatsappTypeTitle = contactWhatsapp?.category?.title ?? "";
            this.whatsappTitle = contact?.title ?? "";
            this.whatsappTarget = contactWhatsapp?.toHtmlTarget() ?? "";
            this.whatsappIcon = contactWhatsapp?.category?.icon ?? "";

            const whatsappHref = contactWhatsapp?.toHtmlHref() ?? "";

            let { product } = this;
            if (!product) {
               this.whatsappHref = whatsappHref;
               return;
            }

            const productLink = this.product.getLink();
            const title = await product.fetchFullTitle();

            let text = `Hi, I am interested in this product`;
            if (title) text += `\n\n${title}`;
            if (productLink) text += `\n${productLink}`;
            const textUri = encodeURIComponent(text);

            this.whatsappHref = `${whatsappHref}&text=${textUri}`;
         },

         findContactByTitle(contacts = [], title = "") {
            return contacts.find((contact) => contact.title === title);
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
         :toShrink="true"
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
