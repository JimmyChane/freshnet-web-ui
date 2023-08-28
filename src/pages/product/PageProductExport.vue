<script>
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import ExportLayoutOption from "./PageProductExport-LayoutOption.vue";
  import ExportButton from "./PageProductExport-Export.vue";
  import LayoutOne from "./PageProductExport-Layout-One.vue";
  import LayoutTwo from "./PageProductExport-Layout-Two.vue";
  import PanelOption from "./PageProductExport-PanelOption.vue";
  import PrintContent from "@/components/PrintContent.vue";
  import Pixel from "@/objects/Pixel";

  class Orientation {
    static Portrait = new Orientation("Portrait");
    static Landscape = new Orientation("Landscape");

    constructor(title = "") {
      this.title = title;
    }
  }
  class Size {
    static A5 = new Size("A5", Pixel.cm(148.5), Pixel.cm(210));
    static A4 = new Size("A4", Pixel.cm(210), Pixel.cm(297));

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
  class Layout {
    static One = new Layout("Layout One");
    static Two = new Layout("Layout Two");

    constructor(title = "") {
      this.title = title;
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
      this.selectedItem =
        this.items[nextIndex >= this.items.length ? 0 : nextIndex];
    }
  }

  export default {
    components: {
      NavigationBar,
      ExportLayoutOption,
      ExportButton,
      LayoutOne,
      LayoutTwo,
      PanelOption,
      PrintContent,
    },
    data: (c) => ({
      product: null,

      options: [
        new Option(
          "Orientation",
          [Orientation.Portrait, Orientation.Landscape],
          0,
        ),
        new Option("Size", [Size.A5, Size.A4], 1),
        new Option("Rows", [new GridCount("1", 1), new GridCount("2", 2)], 1),
        new Option(
          "Columns",
          [new GridCount("1", 1), new GridCount("2", 2)],
          0,
        ),
        new Option("Layouts", [Layout.One, Layout.Two], 0),
      ],
      layouts: [
        { title: "Layout 1" },
        { title: "Layout 2" },
        { title: "Layout 3" },
      ],

      bodyWidth: 0,
      bodyHeight: 0,
    }),
    computed: {
      user: (c) => c.$store.state.stores.login.getters.user,
      allowEdit: (c) => c.user.isTypeAdmin() || c.user.isTypeStaff(),

      productId: (context) => context.$route.query.productId,

      orientation: (c) => c.options[0].selectedItem,
      size: (c) => c.options[1].selectedItem,
      row: (c) => c.options[2].selectedItem,
      column: (c) => c.options[3].selectedItem,
      layout: (c) => c.options[4].selectedItem,

      isPortrait: (c) => c.orientation === Orientation.Portrait,
      isLandscape: (c) => c.orientation === Orientation.Landscape,

      canvasWidth: (c) => (c.isPortrait ? c.size.width : c.size.height),
      canvasHeight: (c) => (c.isPortrait ? c.size.height : c.size.width),
      canvasRowCount: (c) => c.row.count,
      canvasColumnCount: (c) => c.column.count,

      itemWidth: (c) => c.canvasWidth / c.canvasColumnCount,
      itemHeight: (c) => c.canvasHeight / c.canvasRowCount,

      isLayoutOne: (c) => c.layout === Layout.One,
      isLayoutTwo: (c) => c.layout === Layout.Two,
    },
    watch: {
      productId() {
        this.invalidateProduct();
      },
      user(userNow, userWas) {
        if (userWas && !userNow) this.redirectToLogin();
      },
    },
    methods: {
      listenKeyDown(event) {
        if (event.key === "p" && event.ctrlKey) {
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          this.clickExport();
        }
      },

      async invalidateProduct() {
        this.product = null;

        const product = await this.$store.state.stores.product.dispatch(
          "getItemOfId",
          this.productId,
        );
        if (!product) return;

        document.title = await product.fetchFullTitle();

        this.product = product;
      },

      clickExport() {
        this.$refs.canvas.print();
      },

      redirectToLogin() {
        this.$router.replace({
          path: "/login",
          query: { redirect: this.$router.currentRoute.fullPath },
        });
      },
    },
    beforeMount() {
      document.addEventListener("keydown", this.listenKeyDown);
    },
    async mounted() {
      try {
        const user = await this.$store.state.stores.login.dispatch("getUser");
        if (user.isTypeNone()) this.redirectToLogin();
      } catch (error) {
        this.redirectToLogin();
      }

      this.invalidateProduct();
    },
    beforeDestroy() {
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
      <PrintContent
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        :style="{
          margin: '1rem',
          'grid-area': 'preview',
        }"
      >
        <LayoutOne
          v-if="isLayoutOne"
          :width="itemWidth"
          :height="itemHeight"
          :product="product"
        />
        <LayoutTwo
          v-if="isLayoutTwo"
          :width="itemWidth"
          :height="itemHeight"
          :product="product"
        />
      </PrintContent>

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

      .PageProductExport-layouts {
        background: white;
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
