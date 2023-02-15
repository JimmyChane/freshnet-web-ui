<script>
   import SearchInput from "@/components/SearchInput.vue";
   import Footer from "@/app/footer/Footer.vue";

   import Actionbar from "./PageHome-Actionbar.vue";
   import Header from "./PageHome-Header.vue";

   import SectionProduct from "./PageHome-SectionProduct.vue";
   import SectionContact from "./PageHome-SectionContact.vue";
   import SectionPrint from "./PageHome-SectionPrint.vue";
   import SectionLocation from "./PageHome-SectionLocation.vue";
   import SectionHour from "./PageHome-SectionHour.vue";
   import SectionWhatElse from "./PageHome-SectionWhatElse.vue";
   import SectionAboutUs from "./PageHome-SectionAboutUs.vue";
   import SectionFeedback from "./PageHome-SectionFeedback.vue";

   import HostIcon from "@/host/HostIcon";

   export default {
      key: "home",
      name: "Home",
      title: "Home",
      icon: {
         light: new HostIcon("home-FFFFFF.svg"),
         dark: new HostIcon("home-000000.svg"),
      },

      components: {
         SearchInput,
         Footer,
         Actionbar,
         Header,
         SectionProduct,
         SectionContact,
         SectionPrint,
         SectionLocation,
         SectionHour,
         SectionWhatElse,
         SectionAboutUs,
         SectionFeedback,
      },
      computed: {
         // isWide: (c) => c.$root.window.innerWidth > 1170,
         isWide: (c) => c.$root.window.innerWidth > 800,
         isDrawer: (c) => c.$root.navigation.isDrawer(),
         isThin: (c) => c.isWide || c.isDrawer,

         classes: (c) => (c.isWide ? "Home-isHorizontal" : "Home-isVertical"),
      },
      mounted() {
         document.title = "Freshnet Enterprise";
      },
   };
</script>

<template>
   <div :class="['PageHome', classes]">
      <Actionbar class="Home-actionbar" :style="{ 'z-index': '2' }" :isThin="isDrawer" />

      <div class="Home-body">
         <div>
            <Header class="Home-header" />
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

         <div>
            <span class="Home-section-title">Contact Us</span>
            <SectionContact :isThin="isThin" />
         </div>

         <div>
            <span class="Home-section-title">Business Hours</span>
            <SectionHour :isThin="isThin" />
         </div>

         <div>
            <span class="Home-section-title">What else can we do?</span>
            <SectionWhatElse :isThin="isThin" />
         </div>
      </div>

      <Footer />
   </div>
</template>

<style lang="scss" scoped>
   .PageHome {
      z-index: 1;
      width: 100%;
      height: 100%;

      display: flex;
      flex-grow: 1;
      flex-direction: column;
      align-items: center;
      color: black;

      position: relative;
      overflow-x: hidden;
      overflow-y: auto;

      .Home-body {
         z-index: 1;
         width: 100%;

         display: flex;
         flex-direction: column;
         align-items: stretch;

         & > * {
            width: 100%;
            gap: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2rem;

            .Home-section-title {
               font-size: 1.4rem;
               font-weight: 500;

               font-size: 2rem;
               color: hsl(0, 0%, 13%);

               margin-bottom: 1rem;

               display: flex;
               align-items: center;
               justify-content: center;
               text-align: center;
            }

            .Home-HourDescription {
               margin-bottom: 1rem;

               display: flex;
               flex-direction: column;
               align-items: center;
               text-align: center;

               .Home-HourDescription-notice {
                  color: red;
                  font-size: 0.8em;
               }
            }
         }
      }
   }

   .Home-isVertical {
      --actionbar-height: 6rem;
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
   .Home-isHorizontal {
      --actionbar-height: 3.5rem;
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
</style>
