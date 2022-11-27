<script>
   import SearchInput from "@/components/SearchInput.vue";
   import PopupWindow from "@/components/window/PopupWindow.vue";
   import Footer from "@/app/footer/Footer.vue";

   import Actionbar from "./PageHome-Actionbar.vue";
   import Header from "./PageHome-Header.vue";

   import SectionProduct from "./PageHome-SectionProduct.vue";
   import SectionContact from "./PageHome-SectionContact.vue";
   import SectionPrint from "./PageHome-SectionPrint.vue";
   import SectionLocation from "./PageHome-SectionLocation.vue";
   import SectionHour from "./PageHome-SectionHour.vue";
   import SectionAboutUs from "./PageHome-SectionAboutUs.vue";
   import SectionFeedback from "./PageHome-SectionFeedback.vue";

   import ItemSearchProduct from "./ItemSearchProduct.vue";
   import ItemSearchCategory from "./ItemSearchCategory.vue";
   import ItemSearchBrand from "./ItemSearchBrand.vue";
   import ItemSearchPs2Disc from "./ItemSearchPs2Disc.vue";
   import ItemSearchService from "./ItemSearchService.vue";

   export default {
      key: "home",
      name: "Home",
      title: "Home",
      icon: { light: "home-FFFFFF", dark: "home-2A4858" },

      components: {
         SearchInput,
         PopupWindow,
         Footer,
         Actionbar,
         Header,
         ItemSearchProduct,
         ItemSearchCategory,
         ItemSearchBrand,
         ItemSearchPs2Disc,
         ItemSearchService,
         SectionProduct,
         SectionContact,
         SectionPrint,
         SectionLocation,
         SectionHour,
         SectionAboutUs,
         SectionFeedback,
      },
      data() {
         return { scrollTop: 0 };
      },
      computed: {
         whatsappLink: (c) => {
            let phone = "60167959444";
            return `https://api.whatsapp.com/send?phone=${phone}`;
         },

         isThin: (c) => c.$root.navigation.isDrawer(),

         classes() {
            if (this.$root.window.innerWidth > 1170) return "Home-isHorizontal";
            return "Home-isVertical";
         },
      },
      mounted() {
         document.title = "Freshnet Enterprise";
      },
   };
</script>

<template>
   <div :class="['PageHome', classes]">
      <div
         class="Home-scroll"
         @scroll="(e) => (scrollTop = e.target.scrollTop)"
      >
         <Actionbar
            :class="[
               'Home-actionbar',
               scrollTop > 0 ? 'Home-actionbar-giveBorderColor' : '',
            ]"
            :isThin="isThin"
         />

         <div class="Home-body">
            <div class="Home-section-0">
               <Header
                  class="Home-header"
                  :style="{
                     'grid-column': '1 / -1',
                     'grid-row': '1 / span 1',
                  }"
               />
            </div>

            <div class="Home-section-1">
               <SectionProduct
                  :style="{
                     'grid-column': 'auto / span 2',
                     'grid-row': 'auto / span 4',
                  }"
                  :isThin="isThin"
               />
               <SectionPrint
                  :style="{
                     'grid-column': 'auto / span 2',
                     'grid-row': 'auto / span 2',
                  }"
                  :isThin="isThin"
               />
               <SectionLocation
                  :style="{
                     'grid-column': 'auto / span 2',
                     'grid-row': 'auto / span 2',
                  }"
                  :isThin="isThin"
               />
            </div>

            <div class="Home-section-2">
               <span
                  class="Home-section-title"
                  :style="{
                     'grid-column': '1 / -1',
                     'grid-row': '1 / span 1',
                  }"
                  >Contact Us</span
               >
               <SectionContact
                  :style="{
                     'grid-column': 'auto / span 1',
                     'grid-row': 'auto / span 2',
                  }"
                  :isThin="isThin"
               />
            </div>

            <div class="Home-section-3">
               <span
                  class="Home-section-title"
                  :style="{
                     'grid-column': '1 / -1',
                     'grid-row': '1 / span 1',
                  }"
                  >Business Hour</span
               >
               <SectionHour
                  :style="{
                     'grid-column': 'auto / span 2',
                     'grid-row': 'auto / span 2',
                  }"
                  :isThin="isThin"
               />
            </div>
         </div>

         <Footer />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PageHome {
      background: linear-gradient(130.76deg, #edeff3 0%, #e4e4e4 100%);
      background: #e4e4e4;

      display: flex;
      flex-direction: row;
      align-items: stretch;
      color: black;

      .Home-scroll {
         flex-grow: 1;
         z-index: 1;
         width: 100%;
         height: 100%;
         position: relative;
         overflow-x: hidden;
         overflow-y: auto;

         display: flex;
         flex-direction: column;
         align-items: center;

         .Home-actionbar {
            position: sticky;
            top: 0;
            z-index: 2;
            border-bottom: 1px solid transparent;
         }
         .Home-actionbar-giveBorderColor {
            border-bottom: 1px solid #0000001a;
         }
         .Home-body {
            z-index: 1;
            width: 100%;
            gap: 1rem;

            display: flex;
            flex-direction: column;
            align-items: stretch;

            & > * {
               width: 100%;
               gap: 0.5rem;
               display: flex;
               flex-direction: column;

               .Home-section-title {
                  font-size: 1.4rem;
                  font-weight: 500;

                  // --height: 6rem;
                  // min-height: var(--height);
                  // max-height: var(--height);

                  padding-top: 3rem;
                  padding-bottom: 2rem;

                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
               }
            }

            .Home-section-0 {
            }
            .Home-section-1 {
            }
            .Home-section-2 {
            }
            .Home-section-3 {
            }
         }
      }
   }

   .Home-isVertical {
      --actionbar-height: 6rem;
      .Home-scroll {
         .Home-body {
            padding: 1.2rem;

            .Home-section-1 {
               display: grid;
               grid-template-columns: 1fr 1fr;
               grid-auto-flow: row;

               justify-content: center;
               align-items: center;
               justify-items: center;
               align-content: center;
            }
         }
      }
   }
   .Home-isHorizontal {
      --actionbar-height: 3.5rem;
      .Home-scroll {
         .Home-body {
            height: max-content;
            max-width: 80rem;
            max-width: 70rem;
            padding: 2rem;

            .Home-section-1 {
               display: grid;
               grid-template-columns: 1fr 1fr 1fr 1fr;
               grid-auto-flow: row;

               justify-content: center;
               align-items: center;
               justify-items: center;
               align-content: center;
            }
         }
      }
   }
</style>
