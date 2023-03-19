<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import ExportLayoutOption from "./PageProductExport-LayoutOption.vue";
   import ExportButton from "./PageProductExport-Export.vue";
   import LayoutOne from "./PageProductExport-Layout-One.vue";
   import PanelOption from "./PageProductExport-PanelOption.vue";

   const cmToPx = (cm) => cm * 3.7795275591;

   class Orientation {
      static Portrait = new Orientation("Portrait");
      static Landscape = new Orientation("Landscape");

      constructor(title = "") {
         this.title = title;
      }
   }
   class Size {
      static A5 = new Size("A5", cmToPx(148.5), cmToPx(210));
      static A4 = new Size("A4", cmToPx(210), cmToPx(297));

      constructor(title = "", width = 0, height = 0) {
         this.title = title;
         this.width = width;
         this.height = height;
      }
   }
   class GridCount {
      static One = new GridCount("1", 1);
      static Two = new GridCount("2", 2);

      constructor(title = "", count = 0) {
         this.title = title;
         this.count = count;
      }
   }

   class Option {
      selectedItem = null;

      constructor(title = "", items = [], defaultIndex = 0) {
         this.title = title;
         this.items = items;

         this.items.forEach((item) => {
            item.isSelected = () => item === this.selectedItem;
            item.click = () => (this.selectedItem = item);
         });

         this.selectedItem = this.items[defaultIndex];
      }

      click() {
         const index = this.items.indexOf(this.selectedItem);
         const nextIndex = index + 1;
         this.selectedItem = this.items[nextIndex >= this.items.length ? 0 : nextIndex];
      }
   }

   export default {
      components: {
         NavigationBar,
         ExportLayoutOption,
         ExportButton,
         LayoutOne,
         PanelOption,
      },
      data: (c) => ({
         product: null,

         // todo
         options: [
            new Option("Orientation", [Orientation.Portrait, Orientation.Landscape], 0),
            new Option("Size", [Size.A5, Size.A4], 1),
            new Option("Rows", [new GridCount("1", 1), new GridCount("2", 2)], 1),
            new Option("Columns", [new GridCount("1", 1), new GridCount("2", 2)], 0),
         ],
         layouts: [{ title: "Layout 1" }, { title: "Layout 2" }, { title: "Layout 3" }],

         bodyWidth: 0,
         bodyHeight: 0,
         canvasScale: 0,
      }),
      computed: {
         orientation: (c) => c.options[0].selectedItem,
         size: (c) => c.options[1].selectedItem,
         row: (c) => c.options[2].selectedItem,
         column: (c) => c.options[3].selectedItem,

         user: (c) => c.loginStore.getters.user,
         allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

         productId: (context) => context.$route.query.productId,

         isPortrait: (c) => c.orientation.title === "Portrait",
         isLandscape: (c) => c.orientation.title === "Landscape",

         isA5: (c) => c.orientation.title === "A5",
         isA4: (c) => c.orientation.title === "A4",

         canvasWidth: (c) => (c.isPortrait ? c.size.width : c.size.height),
         canvasHeight: (c) => (c.isPortrait ? c.size.height : c.size.width),
         canvasRowCount: (c) => c.row.count,
         canvasColumnCount: (c) => c.column.count,

         itemWidth: (c) => c.canvasWidth / c.canvasColumnCount,
         itemHeight: (c) => c.canvasHeight / c.canvasRowCount,
      },
      watch: {
         productId() {
            this.invalidate();
         },
         user(userNow, userWas) {
            if (userWas && !userNow) this.redirectToLogin();
         },

         orientation() {
            this.invalidateCard();
         },
         size() {
            this.invalidateCard();
         },
         row() {
            this.invalidateCard();
         },
         column() {
            this.invalidateCard();
         },
      },
      methods: {
         listenerResize() {
            this.invalidateCard();
         },
         listenKeyDown(event) {
            if (event.key === "p" && event.ctrlKey) {
               if (event.preventDefault) event.preventDefault();
               if (event.stopPropagation) event.stopPropagation();
               this.clickExport();
            }
         },

         async invalidate() {
            this.product = null;

            const product = await this.productStore.dispatch(
               "getItemOfId",
               this.productId,
            );
            if (!product) return;

            document.title = await product.fetchFullTitle();

            this.product = product;
         },
         invalidateCard(repeatTimeout = 300) {
            const ref = this.$refs.preview;
            if (!ref) return;

            this.bodyWidth = ref.offsetWidth;
            this.bodyHeight = ref.offsetHeight;

            const { canvasWidth, canvasHeight } = this;

            const scaleWidth = this.bodyWidth / canvasWidth;
            const scaleHeight = this.bodyHeight / canvasHeight;

            this.canvasScale = scaleWidth > scaleHeight ? scaleHeight : scaleWidth;

            if (repeatTimeout) {
               setTimeout(() => this.invalidateCard(0), repeatTimeout);
            }
         },

         clickExport() {
            const ref = this.$refs.canvas;
            if (!ref) return;
            this.$root.print(ref);
         },

         redirectToLogin() {
            this.$router.replace({
               path: "/login",
               query: { redirect: this.$router.currentRoute.fullPath },
            });
         },
      },
      beforeMount() {
         window.addEventListener("resize", this.listenerResize);
         document.addEventListener("keydown", this.listenKeyDown);
      },
      async mounted() {
         try {
            const user = await this.loginStore.dispatch("getUser");
            if (user.isTypeNone()) this.redirectToLogin();
         } catch (error) {
            this.redirectToLogin();
         }

         this.invalidate();
         this.invalidateCard();
      },
      beforeDestroy() {
         window.removeEventListener("resize", this.listenerResize);
         document.removeEventListener("keydown", this.listenKeyDown);
      },
   };
</script>

<template>
   <div class="PageProductExport" v-if="allowEdit">
      <NavigationBar :style="{ 'grid-area': 'toolbar' }">
         <div class="PageProductExport-toolbar">
            <ExportButton @click="() => clickExport()" />
         </div>
      </NavigationBar>

      <div class="PageProductExport-body">
         <div
            class="PageProductExport-preview"
            ref="preview"
            :style="{ 'grid-area': 'preview' }"
         >
            <div
               class="PageProductExport-canvas"
               ref="canvas"
               :style="{
                  '--preview-width': `${bodyWidth}px`,
                  '--preview-height': `${bodyHeight}px`,

                  '--canvas-width': `${canvasWidth}px`,
                  '--canvas-height': `${canvasHeight}px`,
                  '--canvas-scale': `${canvasScale}`,

                  '--item-width': `${itemWidth}px`,
                  '--item-height': `${itemHeight}px`,

                  '--row-count': `${canvasRowCount}`,
                  '--column-count': `${canvasColumnCount}`,
               }"
            >
               <LayoutOne :width="itemWidth" :height="itemHeight" :product="product" />
            </div>
         </div>

         <!-- <div class="PageProductExport-layouts" :style="{ 'grid-area': 'layouts' }">
            <ExportLayoutOption
               v-for="layout of layouts"
               :key="layout.title"
               :title="layout.title"
            />
         </div> -->

         <PanelOption
            class="PageProductExport-panelOption"
            :style="{ 'grid-area': 'panelOption' }"
            :items="options"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PageProductExport {
      width: 100%;
      height: 100%;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: stretch;

      .PageProductExport-toolbar {
         flex-grow: 1;
         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: flex-end;
         gap: 0.5rem;
         padding: 0.5rem;

         .PageProductExport-options {
            gap: 0.5rem;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
         }
      }
      .PageProductExport-body {
         width: 100%;
         height: 100%;
         overflow: hidden;
         display: grid;
         grid-template-areas: "layouts preview panelOption";
         grid-template-rows: 1fr;
         grid-template-columns: 14rem 1fr;

         grid-template-areas: "preview panelOption";
         grid-template-rows: 1fr;
         grid-template-columns: 1fr 14rem;

         .PageProductExport-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin: 1rem;

            .PageProductExport-canvas {
               width: var(--canvas-width);
               height: var(--canvas-height);
               min-width: var(--canvas-width);
               min-height: var(--canvas-height);
               max-width: var(--canvas-width);
               max-height: var(--canvas-height);

               background: white;
               box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
               transform: scale(var(--canvas-scale));
               position: absolute;
               top: calc(0 - var(--canvas-height) * var(--canvas-scale));
               left: calc(0 - var(--canvas-width) * var(--canvas-scale));

               align-items: center;
               justify-content: center;

               display: grid;
               grid-template-rows: repeat(var(--row-count), 1fr);
               grid-template-columns: repeat(var(--column-count), 1fr);

               overflow: hidden;
            }
         }
         .PageProductExport-layouts {
            background-color: white;
            gap: 0.5rem;
            padding: 1rem;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
         }
      }
   }
</style>
