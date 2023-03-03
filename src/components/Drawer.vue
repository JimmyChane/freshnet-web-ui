<script>
   const Edge = { LEFT: 1, RIGHT: 2 };
   const Mode = {
      FIXED: 1, // default FIXED_EXPAND
      FIXED_EXPAND: 2,
      FIXED_COLLAPSE: 3,

      DRAWER_EXPAND: 4,
      DRAWER_COLLAPSE: 5,
   };

   export default {
      Edge,
      Mode,

      emits: ["click-collapse"],
      props: {
         mode: { type: Number, default: Mode.DRAWER_COLLAPSE },
         edge: { type: Number, default: 0 },
      },
      data: (c) => ({
         isDragging: false,
         dragStart: 0,
         dragEnd: 0,
         dragPercent: 0,
         dragX: 0,
         dragY: 0,
      }),
      computed: {
         isLeft: (c) => c.edge === Edge.LEFT,
         isRight: (c) => c.edge === Edge.RIGHT,

         isFixedExpand: (c) => c.mode === Mode.FIXED_EXPAND || c.mode === Mode.FIXED,
         isFixedCollapse: (c) => c.mode === Mode.FIXED_COLLAPSE,
         isDrawer: (c) => c.isDrawerExpand || c.isDrawerCollapse,
         isDrawerExpand: (c) => c.mode === Mode.DRAWER_EXPAND,
         isDrawerCollapse: (c) => c.mode === Mode.DRAWER_COLLAPSE,

         point() {
            if (this.isLeft) {
               return { xStart: "-100%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
            }
            if (this.isRight) {
               return { xStart: "100%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
            }
            return { xStart: "0%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
         },

         classEdge() {
            if (this.isLeft) return "Drawer-DIRECTION_LEFT";
            if (this.isRight) return "Drawer-DIRECTION_RIGHT";
            return "";
         },
         classModes() {
            if (this.isFixedExpand) return ["Drawer-FIXED", "Drawer-FIXED_EXPAND"];
            if (this.isFixedCollapse) return ["Drawer-FIXED", "Drawer-FIXED_COLLAPSE"];
            if (this.isDrawerExpand) return ["Drawer-DRAWER", "Drawer-DRAWER_EXPAND"];
            if (this.isDrawerCollapse) return ["Drawer-DRAWER", "Drawer-DRAWER_COLLAPSE"];
            return "";
         },

         style() {
            const style = {
               "--x-start": this.point.xStart,
               "--y-start": this.point.yStart,
               "--x-end": this.point.xEnd,
               "--y-end": this.point.yEnd,
            };

            if (!this.isDragging) {
               style["--body-transition-duration"] = "var(--transition-duration)";
               style["--body-transition-timing-function"] = "cubic-bezier(1, 0, 0, 1)";
            }

            if (this.isDragging) {
               style["--drag-x"] = `${this.dragX}px`;
               style["--drag-y"] = `${this.dragY}px`;
               style["--drag-percent"] = `${this.dragPercent}`;
               style["--body-shadow"] = "box-shadow: 0 0 1rem hsl(0, 0%, 0%);";
            }
            if (!this.isDragging && this.isDrawerExpand) {
               style["--drag-percent"] = 1;
            }
            if (!this.isDragging && this.isDrawerCollapse) {
               style["--drag-percent"] = 0;
            }

            return style;
         },
         styleBody() {
            if (!this.isDragging && this.isDrawer) return "none";
            if (this.isLeft) return { "border-right": "1px solid hsl(0, 0%, 80%)" };
            if (this.isRight) return { "border-left": "1px solid hsl(0, 0%, 80%)" };
            return "none";
         },
      },
      methods: {
         onDragStart(x, y) {
            if (!this.isDrawerCollapse) return;

            const Body = this.$refs.Body;
            if (!Body) return;

            this.isDragging = true;
            this.dragStart = -Body.offsetWidth;
            this.dragEnd = 0;
            this.dragX = x;
            this.dragY = y;
         },
         onDragMove(x, y) {
            if (!this.isDragging) return;

            this.dragPercent = Math.abs(x / this.dragStart);

            this.dragX = x;
            this.dragY = y;
         },
         onDragEnd(x, y) {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.dragX = 0;
            this.dragY = 0;
         },
      },
   };
</script>

<template>
   <div :class="['Drawer', classEdge, ...classModes]" :style="style">
      <div class="Drawer-body" ref="Body" :style="styleBody"><slot /></div>

      <div
         class="Drawer-dismissableBox"
         v-if="isDrawer"
         @click="$emit('click-collapse')"
      ></div>

      <div class="Drawer-background transition" v-if="isDrawer"></div>
   </div>
</template>

<style lang="scss" scoped>
   .Drawer {
      display: flex;

      .Drawer-body {
         z-index: 3;
         flex-shrink: 1;
         width: 100%;
         height: 100%;
         max-width: max-content;
         max-height: max-content;
         display: flex;
         flex-direction: column;
      }
      .Drawer-dismissableBox {
         z-index: 2;
         flex-grow: 1;
         width: 100%;
      }
      .Drawer-background {
         z-index: 1;
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;

         background-color: hsla(0, 0%, 0%, 0.7);
         pointer-events: none;

         @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            font-size: 1rem;
            -webkit-backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
            backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
         }
      }
   }

   .Drawer-DIRECTION_LEFT {
      flex-direction: row;
      top: 0;
      bottom: 0;
      left: 0;
   }
   .Drawer-DIRECTION_RIGHT {
      flex-direction: row-reverse;
      top: 0;
      bottom: 0;
      right: 0;
   }

   .Drawer-FIXED {
      width: max-content;
      height: 100%;
      position: sticky;

      .Drawer-body {
         transition-duration: var(--transition-duration);
         transition-timing-function: cubic-bezier(1, 0, 0, 1);
      }
   }
   .Drawer-FIXED_EXPAND {
      .Drawer-body {
         transform: translateX(var(--x-end)) translateY(var(--y-end));
      }
   }
   .Drawer-FIXED_COLLAPSE {
      .Drawer-body {
         transform: translateX(var(--x-start)) translateY(var(--y-start));
         box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
      }
   }

   .Drawer-DRAWER {
      height: 100%;
      width: 100%;
      position: absolute;

      --drag-x: 0px;
      --drag-y: 0px;
      --drag-percent: 0;
      --body-shadow: unset;
      --body-transition-duration: unset;
      --body-transition-timing-function: unset;
      .Drawer-body {
         box-shadow: var(--body-shadow);
         transition-duration: var(--body-transition-duration);
         transition-timing-function: var(--body-transition-timing-function);
      }
      .Drawer-background {
         opacity: var(--drag-percent);
         @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            font-size: 1rem;
            -webkit-backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
            backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
         }
      }
   }
   .Drawer-DRAWER_EXPAND {
      position: absolute;
      .Drawer-body {
         transform: translateX(var(--x-end)) translateY(var(--y-end));
      }
      .Drawer-dismissableBox {
         display: block;
      }
   }
   .Drawer-DRAWER_COLLAPSE {
      pointer-events: none;
      .Drawer-body {
         transform: translateX(calc(var(--x-start) + var(--drag-x)))
            translateY(var(--y-start));
      }
      .Drawer-dismissableBox {
         display: none;
      }
   }
</style>
