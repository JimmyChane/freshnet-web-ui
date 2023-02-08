<script>
   import NavigationBar from "@/components/actionbar/NavigationBar.vue";
   import Tabs from "./PagePrint-Tabs.vue";
   import Card from "./PagePrint-Card.vue";
   import Footer from "@/app/footer/Footer.vue";

   import PaperSide from "./PaperSide";
   import Paper from "./Paper";
   import Output from "./Output";
   import PaperSize from "./PaperSize";
   import Price from "@/objects/Price";
   import HostIcon from "@/host/HostIcon";

   class Media {
      constructor(title = "", items = []) {
         this.title = title;
         this.items = items;
      }
   }
   class Category {
      constructor(res, items) {
         this.title = res ? res.toString() : "";
         this.icon = res ? res.paperType.icon : "";
         this.items = items;
      }
   }
   class Subcategory {
      constructor(res, items) {
         this.title = res ? res.toString() : "";
         this.icon = res ? res.color.icon : "";
         this.items = items;
      }
   }
   class Item {
      constructor(res, price) {
         this.title = res ? res.title : "";
         this.icon = res ? res.icon : "";
         this.price = price;
      }
   }

   export default {
      key: "print",
      title: "Printing",
      icon: {
         light: new HostIcon("paper-FFFFFF.svg"),
         dark: new HostIcon("paper-000000.svg"),
      },

      components: { NavigationBar, Tabs, Card, Footer },
      data() {
         return {
            items: [
               new Media("Photostat", [
                  new Category(Paper.PlainA4, [
                     new Subcategory(Output.BlackWhite, [
                        new Item(PaperSide.Front, new Price(0.1)),
                        new Item(PaperSide.FrontBack, new Price(0.2)),
                        new Item(PaperSide.FrontIc, new Price(0.2)),
                     ]),
                     new Subcategory(Output.Colorful, [
                        new Item(PaperSide.Front, new Price(1)),
                        new Item(PaperSide.FrontBack, new Price(2)),
                        new Item(PaperSide.FrontIc, new Price(2)),
                     ]),
                  ]),
                  new Category(Paper.PlainA3, [
                     new Subcategory(Output.BlackWhite, [
                        new Item(PaperSide.Front, new Price(0.2)),
                        new Item(PaperSide.FrontBack, new Price(0.4)),
                     ]),
                     new Subcategory(Output.Colorful, [
                        new Item(PaperSide.Front, new Price(2)),
                        new Item(PaperSide.FrontBack, new Price(4)),
                     ]),
                  ]),
               ]),
               new Media("Computer Print", [
                  new Category(Paper.PlainA4, [
                     new Subcategory(Output.BlackWhite, [
                        new Item(PaperSide.Front, new Price(0.5)),
                        new Item(PaperSide.FrontBack, new Price(1.0)),
                     ]),
                     new Subcategory(Output.Colorful, [
                        new Item(PaperSide.Front, new Price(1.0)),
                        new Item(PaperSide.FrontBack, new Price(2.0)),
                     ]),
                  ]),
                  new Category(Paper.PlainA3, [
                     new Subcategory(Output.BlackWhite, [
                        new Item(PaperSide.Front, new Price(1.0)),
                        new Item(PaperSide.FrontBack, new Price(2.0)),
                     ]),
                     new Subcategory(Output.Colorful, [
                        new Item(PaperSide.Front, new Price(2.0)),
                        new Item(PaperSide.FrontBack, new Price(4.0)),
                     ]),
                  ]),
                  new Category(Paper.Photo4R, [
                     new Subcategory(Output.BorderlessColorful, [
                        new Item(PaperSide.Front, new Price(1.5)),
                     ]),
                  ]),
                  new Category(Paper.PhotoA4, [
                     new Subcategory(Output.BorderlessColorful, [
                        new Item(PaperSide.Front, new Price(4.0)),
                     ]),
                  ]),
               ]),
               new Media("Laminate Document", [
                  new Category(null, [
                     new Subcategory(null, [
                        new Item(PaperSize.A4, new Price(2.0)),
                        new Item(PaperSize.A3, new Price(4.0)),
                     ]),
                  ]),
               ]),
               new Media("Scan Document", [
                  new Category(null, [
                     new Subcategory(null, [
                        new Item(PaperSize.A4, new Price(0.5)),
                        new Item(PaperSize.A3, new Price(0.5)),
                     ]),
                  ]),
               ]),
               new Media("Binding", [
                  new Category(null, [
                     new Subcategory(
                        { toString: () => "Comb", color: { icon: "" } },
                        [
                           new Item({ title: "8mm" }, new Price(1.0)),
                           new Item({ title: "10mm" }, new Price(1.0)),
                           new Item({ title: "12mm" }, new Price(1.5)),
                           new Item({ title: "14mm" }, new Price(2.0)),
                           new Item({ title: "16mm" }, new Price(2.0)),
                           new Item({ title: "25mm" }, new Price(3.0)),
                        ],
                     ),
                     new Subcategory(null, [
                        new Item({ title: "Tape & Staple" }, new Price(1.0)),
                     ]),
                  ]),
               ]),
            ],

            tab0: null,
            tab1: null,
            tab2: null,
         };
      },
      computed: {
         tabs0() {
            return this.items.map((layer) => {
               const tab = { title: layer.title };
               tab.isSelected = () => tab === this.tab0;
               tab.click = () => {
                  this.tab0 = tab;
                  this.tab1 = this.tabs1[0];
               };
               return tab;
            });
         },
         tabs1() {
            if (this.tabs0.length === 0) return [];

            const layer = this.items.find((layer) => {
               return layer.title === this.tab0.title;
            });

            if (!layer) return [];
            if (!Array.isArray(layer.items)) return [];
            if (layer.items.length === 0) return [];

            return layer.items.map((layer) => {
               const tab = { title: layer.title };
               tab.isSelected = () => tab === this.tab1;
               tab.click = () => (this.tab1 = tab);
               return tab;
            });
         },
         tabs2() {
            if (this.tabs1.length === 0) return [];

            const layer = this.items
               .find((layer) => layer.title === this.tab0.title)
               .items.find((layer) => layer.title === this.tab1.title);

            if (!layer) return [];
            if (!Array.isArray(layer.items)) return [];
            if (layer.items.length === 0) return [];

            return layer.items.map((layer) => {
               const tab = { title: layer.title };
               tab.isSelected = () => tab === this.tab2;
               tab.click = () => (this.tab2 = tab);
               return tab;
            });
         },

         currentLayer() {
            if (this.tabs1.length === 0) return null;

            const layer1 = this.items.find((layer) => {
               return layer.title === this.tab0.title;
            });
            const layer2 = layer1.items.find((layer) => {
               return layer.title === this.tab1.title;
            });
            const layer3 = layer2.items.find((layer) => {
               return layer.title === this.tab2.title;
            });

            if (layer2) return layer2;
            if (layer1) return layer1;
            if (layer3) return layer3;

            console.log(layer);

            return layer;
         },
      },
      created() {
         this.tab0 = this.tabs0[0];
         this.tab1 = this.tabs1[0];
         this.tab2 = this.tabs2[0];
      },
   };
</script>

<template>
   <div class="PagePrint">
      <NavigationBar class="PagePrint-actionbar" :title="$options.title" />

      <div class="PagePrint-tabs">
         <Tabs v-if="tabs0.length" :items="tabs0" />
         <Tabs v-if="tabs1.length" :items="tabs1" />
      </div>

      <div class="PagePrint-body" v-if="currentLayer">
         <Card
            v-for="preview of currentLayer.items"
            :key="preview.title"
            :preview="preview"
         />
      </div>

      <Footer />
   </div>
</template>

<style lang="scss" scoped>
   .PagePrint {
      width: 100%;
      overflow-y: auto;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .PagePrint-actionbar {
         z-index: 2;
      }

      .PagePrint-tabs {
         width: 100%;
         max-width: max-content;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-start;
         margin-top: 1rem;
         margin-bottom: 1rem;
      }

      .PagePrint-body {
         z-index: 1;
         gap: 2rem;
         padding: 1rem;

         display: flex;
         flex-direction: row;
         flex-wrap: wrap;
         flex-grow: 1;
         align-items: flex-start;
         justify-content: center;
      }
   }
</style>
