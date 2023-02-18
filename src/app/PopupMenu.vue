<script>
   const Width = {
      AUTO: 0,

      MIN: 1,
      MAX: 2,
      SAME: 3,
   };
   const Corner = {
      AUTO: 0,

      TOP: 1,
      RIGHT: 2,
      BOTTOM: 3,
      LEFT: 4,

      TOP_LEFT: 5,
      TOP_RIGHT: 6,
      BOTTOM_LEFT: 7,
      BOTTOM_RIGHT: 8,
   };

   import Item from "./PopupMenu-Item.vue";

   export default {
      Width,
      Corner,

      components: { Item },
      props: { popupMenu: { default: undefined } },
      data() {
         return {
            top: 0,
            left: 0,

            classTransition: "",
            classState: "PopupMenu-isHiding",
            stylePointerEvent: "none",

            width: 0,
            height: 0,
            halfWidth: 0,
            halfHeight: 0,
            x: 0,
            y: 0,
         };
      },
      computed: {
         isShowing: (c) => c.popupMenu.isShowing,
         anchor: (c) => c.popupMenu.anchor,
         menus: (c) => c.popupMenu.menus,
         preferWidth: (c) => c.popupMenu.width,
         corner: (c) => c.popupMenu.corner,

         style: (c) => {
            const style = {
               "--width": `${c.width}px`,
               "--height": `${c.height}px`,
               "--halfWidth": `${c.halfWidth}px`,
               "--halfHeight": `${c.halfHeight}px`,
               "--x": `${c.x}px`,
               "--y": `${c.y}px`,
               "pointer-events": c.stylePointerEvent,
            };

            if (c.preferWidth === Width.MIN) {
               style["min-width"] = "min-content";
               style["width"] = "min-content";
            }
            if (c.preferWidth === Width.MAX) {
               style["min-width"] = `${c.width}px`;
               style["width"] = "max-content";
            }
            if (c.preferWidth === Width.SAME) {
               style["min-width"] = `${c.width}px`;
               style["width"] = `${c.width}px`;
            }
            return style;
         },

         classCorner: (c) => {
            if (c.corner === Corner.TOP) return "PopupMenu-Top";
            if (c.corner === Corner.RIGHT) return "PopupMenu-Right";
            if (c.corner === Corner.BOTTOM) return "PopupMenu-Bottom";
            if (c.corner === Corner.LEFT) return "PopupMenu-Left";
            if (c.corner === Corner.TOP_LEFT) return "PopupMenu-TopLeft";
            if (c.corner === Corner.TOP_RIGHT) return "PopupMenu-TopRight";
            if (c.corner === Corner.BOTTOM_LEFT) return "PopupMenu-BottomLeft";
            if (c.corner === Corner.BOTTOM_RIGHT) return "PopupMenu-BottomRight";
            return "";
         },
      },
      watch: {
         isShowing() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         invalidate() {
            if (!this.isShowing) {
               this.classState = "PopupMenu-isHiding";
               this.stylePointerEvent = "none";
               setTimeout(() => {
                  this.width = 0;
                  this.height = 0;
                  this.halfWidth = 0;
                  this.halfHeight = 0;
                  this.x = 0;
                  this.y = 0;
                  this.classTransition = "";
               }, 200);
               return;
            }

            this.classTransition = "transition";

            const rect = this.anchor.getBoundingClientRect();

            this.width = rect.width;
            this.height = rect.height;
            this.halfWidth = this.width / 2;
            this.halfHeight = this.height / 2;
            switch (this.corner) {
               case Corner.TOP:
                  this.x = rect.left + this.halfWidth;
                  this.y = rect.top;
                  break;
               case Corner.RIGHT:
                  this.x = rect.left + this.width;
                  this.y = rect.top + this.halfHeight;
                  break;
               case Corner.BOTTOM:
                  this.x = rect.left + this.halfWidth;
                  this.y = rect.top + this.height;
                  break;
               case Corner.LEFT:
                  this.x = rect.left;
                  this.y = rect.top + this.halfHeight;
                  break;
               case Corner.TOP_LEFT:
                  this.x = rect.left;
                  this.y = rect.top;
                  break;
               case Corner.TOP_RIGHT:
                  this.x = rect.left + this.width;
                  this.y = rect.top;
                  break;
               case Corner.BOTTOM_LEFT:
                  this.x = rect.left;
                  this.y = rect.top + this.height;
                  break;
               default:
               case Corner.BOTTOM_RIGHT:
                  this.x = rect.left + this.width;
                  this.y = rect.top + this.height;
                  break;
            }

            setTimeout(() => {
               this.classState = "PopupMenu-isShowing";
               this.stylePointerEvent = "initial";
            }, 200);
         },
      },
   };
</script>

<template>
   <div :class="['PopupMenu', classTransition, classState, classCorner]" :style="style">
      <div class="PopupMenu-scroll scrollbar">
         <Item
            class="transition"
            v-for="menu of menus"
            :key="menu.key"
            :menu="menu"
            @click="
               (menu) => {
                  popupMenu.hide();
                  if (typeof menu.click === 'function') menu.click(menu);
               }
            "
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PopupMenu {
      display: flex;
      overflow: hidden;

      min-width: 10em;
      width: max-content;
      height: max-content;
      max-height: 20em;

      border-radius: 1em;
      box-shadow: 0 0 1em hsla(0, 0%, 0%, 0.1);
      border: 1px solid hsla(0, 0%, 0%, 0.1);
      --transition-timing: cubic-bezier(1, 0, 0, 1);

      .PopupMenu-scroll {
         --padding-horizontal: 0.5em;

         padding: var(--padding-horizontal) 0;
         padding-right: 1px;
         min-width: inherit;
         width: inherit;
         height: inherit;
         max-height: inherit;

         overflow-x: hidden;
         overflow-y: auto;
         --scrollbar-size: 0.4em;
         --scrollbar-thumb-radius: 0.4em;
         --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
         --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
         --scrollbar-track-margin: var(--padding-horizontal);

         display: flex;
         flex-direction: column;
         align-items: stretch;

         background-color: white;
      }

      position: absolute;
      top: 0;
      left: 0;

      top: var(--y);
      left: var(--x);
   }
   .PopupMenu-isShowing {
      opacity: 1;
      transform: var(--transform-end);
   }
   .PopupMenu-isHiding {
      opacity: 0;
      transform: var(--transform-start);
   }

   .PopupMenu-Top {
      --transform-start: translateX(calc(0px - 50%))
         translateY(calc(0px - 100% + var(--halfHeight)));
      --transform-end: translateX(calc(0px - 50%))
         translateY(calc(0px - 100% + calc(var(--halfHeight) * 0.5)));
   }
   .PopupMenu-Right {
      --transform-start: translateX(calc(0px - var(--halfWidth)))
         translateY(calc(0px - 50%));
      --transform-end: translateX(calc(0px - calc(var(--halfWidth) * 0.5)))
         translateY(calc(0px - 50%));
   }
   .PopupMenu-Bottom {
      --transform-start: translateX(calc(0px - 50%))
         translateY(calc(0px - var(--halfHeight)));
      --transform-end: translateX(calc(0px - 50%))
         translateY(calc(0px - calc(var(--halfHeight) * 0.5)));
   }
   .PopupMenu-Left {
      --transform-start: translateX(calc(0px - 100% + var(--halfWidth)))
         translateY(calc(0px - 50%));
      --transform-end: translateX(calc(0px - 100% + calc(var(--halfWidth) * 0.5)))
         translateY(calc(0px - 50%));
   }

   .PopupMenu-TopLeft {
      --transform-start: translateX(calc(0px - 100% + var(--halfWidth)))
         translateY(calc(0px - 100% + var(--halfHeight)));
      --transform-end: translateX(calc(0px - 100% + calc(var(--halfWidth) * 0.5)))
         translateY(calc(0px - 100% + calc(var(--halfHeight) * 0.5)));
   }
   .PopupMenu-TopRight {
      --transform-start: translateX(calc(0px - var(--halfWidth)))
         translateY(calc(0px - 100% + var(--halfHeight)));
      --transform-end: translateX(calc(0px - calc(var(--halfWidth) * 0.5)))
         translateY(calc(0px - 100% + calc(var(--halfHeight) * 0.5)));
   }
   .PopupMenu-BottomLeft {
      --transform-start: translateX(calc(0px - 100% + var(--halfWidth)))
         translateY(calc(0px - var(--halfHeight)));
      --transform-end: translateX(calc(0px - 100% + calc(var(--halfWidth) * 0.5)))
         translateY(calc(0px - calc(var(--halfHeight) * 0.5)));
   }
   .PopupMenu-BottomRight {
      --transform-start: translateX(calc(0px - var(--halfWidth)))
         translateY(calc(0px - var(--halfHeight)));
      --transform-end: translateX(calc(0px - calc(var(--halfWidth) * 0.5)))
         translateY(calc(0px - calc(var(--halfHeight) * 0.5)));
   }
</style>
