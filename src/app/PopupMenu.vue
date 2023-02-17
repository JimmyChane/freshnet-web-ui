<script>
   const Size = {
      AUTO: 0,

      MIN: 1,
      MAX: 2,
      FILL: 3,
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
   const Alignment = {
      AUTO: 0,

      CENTER: 1,
      START: 2,
      END: 3,
   };

   export default {
      Size,
      Corner,

      props: {
         popupMenu: { default: undefined },
      },
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
         size: (c) => c.popupMenu.size,
         corner: (c) => c.popupMenu.corner,

         // corner: (c) => Corner.BOTTOM, // test

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
   <div
      :class="['PopupMenu', classTransition, classState, classCorner]"
      :style="{
         '--width': `${width}px`,
         '--height': `${height}px`,
         '--halfWidth': `${halfWidth}px`,
         '--halfHeight': `${halfHeight}px`,
         '--x': `${x}px`,
         '--y': `${y}px`,
         'pointer-events': stylePointerEvent,
      }"
   >
      <div class="PopupMenu-scroll scrollbar">
         <button
            class="transition"
            v-for="menu of menus"
            :key="menu.key"
            @click="
               () => {
                  popupMenu.hide();
                  if (typeof menu.click === 'function') menu.click(menu);
               }
            "
         >
            <img v-if="menu.icon" :src="menu.icon" :alt="`Icon ${menu.title}`" />
            <span>{{ menu.title }}</span>
         </button>
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

         & > * {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;

            background: none;
            border: none;
            font-size: 1em;
            cursor: pointer;

            width: 100%;
            min-width: inherit;
            overflow: hidden;
            padding: 1em 1.2em;
            gap: 1em;

            &:hover {
               background: hsla(0, 0%, 0%, 0.1);
            }

            img {
               --icon-size: 1em;
               width: var(--icon-size);
               height: var(--icon-size);
               max-width: initial;
               max-height: initial;
            }
            span {
               flex-grow: 1;
               min-width: max-content;
               text-align: start;
               font-size: 0.9em;
               font-weight: 400;
               color: black;
            }
         }
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
