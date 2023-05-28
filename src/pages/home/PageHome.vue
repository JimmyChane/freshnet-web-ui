<script>
   import Footer from "@/app/footer/Footer.vue";

   import Actionbar from "./PageHome-Actionbar.vue";
   import Header from "./PageHome-Header.vue";

   import SectionTitle from "./PageHome-Section-Title.vue";
   import SectionProduct from "./PageHome-SectionProduct.vue";
   import SectionContact from "./PageHome-SectionContact.vue";
   import SectionPrint from "./PageHome-SectionPrint.vue";
   import SectionLocation from "./PageHome-SectionLocation.vue";
   import SectionCategory from "./PageHome-SectionCategory.vue";
   import SectionHour from "./PageHome-SectionHour.vue";
   import SectionWhatElse from "./PageHome-SectionWhatElse.vue";

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
         Footer,
         Actionbar,
         Header,
         SectionTitle,
         SectionProduct,
         SectionContact,
         SectionPrint,
         SectionLocation,
         SectionCategory,
         SectionHour,
         SectionWhatElse,
      },
      computed: {
         innerWidth: (c) => c.$root.window.innerWidth,

         isWide: (c) => c.innerWidth > 800,
         isDrawer: (c) => c.$root.navigation.isDrawer(),
         isThin: (c) => c.isWide || c.isDrawer,

         classes: (c) => (c.isWide ? "Home-isOver800" : "Home-isLess"),
      },
      mounted() {
         document.title = "Freshnet Enterprise";
      },
   };
</script>

<template>
   <div :class="['PageHome', classes]">
      <Actionbar
         class="Home-actionbar"
         :style="{ 'z-index': '2' }"
         :isThin="isDrawer"
      />

      <div class="Home-body">
         <Header class="Home-header" />

         <div class="Home-grid">
            <SectionProduct
               :style="{ 'grid-area': 'product' }"
               :isThin="isThin"
            />
            <SectionCategory :style="{ 'grid-area': 'category' }" />

            <SectionContact
               :style="{ 'grid-area': 'contact' }"
               :isThin="isThin"
            />
            <SectionHour :style="{ 'grid-area': 'hour' }" :isThin="isThin" />

            <SectionTitle
               :style="{ 'grid-area': 'service-title' }"
               title="Services"
            />
            <SectionPrint :style="{ 'grid-area': 'print' }" :isThin="isThin" />
            <SectionLocation
               :style="{ 'grid-area': 'location' }"
               :isThin="isThin"
            />
            <SectionWhatElse
               :style="{ 'grid-area': 'else' }"
               :isThin="isThin"
            />
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
         max-width: 50rem;
         height: max-content;
         padding: 2rem;

         display: flex;
         flex-direction: column;
         align-items: stretch;

         .Home-grid {
            width: 100%;
            gap: 0.5rem;
            margin-top: 2rem;

            display: grid;
            grid-auto-flow: row;
            justify-content: center;
            align-items: center;
            justify-items: center;
            align-content: center;
         }
      }
   }

   .Home-isLess {
      --actionbar-height: 6rem;
      .Home-body {
         padding: 1.2rem;

         .Home-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
               "product"
               "category"
               "contact"
               "hour"
               "service-title"
               "print"
               "location"
               "else";
         }
      }
   }
   .Home-isOver800 {
      --actionbar-height: 3.5rem;
      .Home-body {
         .Home-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-areas:
               "product product"
               "category category"
               "contact contact"
               "hour hour"
               "service-title service-title"
               "print location"
               "else else";
         }
      }
   }
</style>
