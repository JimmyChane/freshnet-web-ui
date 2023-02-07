<script>
   const Corner = {
      AUTO: 0,
      TOP_LEFT: 1,
      TOP_RIGHT: 2,
      BOTTOM_LEFT: 3,
      BOTTOM_RIGHT: 4,
   };

   export default {
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

            halfWidth: 0,
            halfHeight: 0,
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,

            moveY: 0,
         };
      },
      computed: {
         isShowing: (c) => c.popupMenu.isShowing,
         anchor: (c) => c.popupMenu.anchor,
         menus: (c) => c.popupMenu.menus,
         corner: (c) => c.popupMenu.corner,
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
                  this.halfWidth = 0;
                  this.halfHeight = 0;
                  this.startX = 0;
                  this.startY = 0;
                  this.endX = 0;
                  this.endY = 0;
                  this.classTransition = "";
               }, 200);
               return;
            }

            // const { width, height } = screen;

            this.classTransition = "transition";

            const rect = this.anchor.getBoundingClientRect();

            this.halfWidth = rect.width / 2;
            this.halfHeight = rect.height / 2;

            switch (this.corner) {
               case Corner.TOP_LEFT:
                  this.invalidateTopLeft(rect);
                  break;
               case Corner.TOP_RIGHT:
                  this.invalidateTopRight(rect);
                  break;
               case Corner.BOTTOM_LEFT:
                  this.invalidateBottomLeft(rect);
                  break;
               default:
               case Corner.BOTTOM_RIGHT:
                  this.invalidateBottomRight(rect);
                  break;
            }

            setTimeout(() => {
               this.classState = "PopupMenu-isShowing";
               this.stylePointerEvent = "initial";
            }, 200);
         },
         invalidateTopLeft(rect) {
            this.startX = rect.left + this.halfWidth - 159;
            this.startY = rect.top + this.halfHeight - 105;

            this.endX = this.startX;
            this.endY = this.startY;

            this.moveY = 1;
         },
         invalidateTopRight(rect) {
            this.startX = rect.left + this.halfWidth;
            this.startY = rect.top + this.halfHeight - 105;

            this.endX = this.startX;
            this.endY = this.startY;

            this.moveY = 1;
         },
         invalidateBottomLeft(rect) {
            this.startX = rect.left + this.halfWidth - 159;
            this.startY = rect.top + this.halfHeight;

            this.endX = this.startX - this.halfWidth;
            this.endY = this.startY;

            this.moveY = -1;
         },
         invalidateBottomRight(rect) {
            this.startX = rect.left + this.halfWidth;
            this.startY = rect.top + this.halfHeight;

            this.endX = this.startX;
            this.endY = this.startY;

            this.moveY = -1;
         },
      },
   };
</script>

<template>
   <div
      :class="['PopupMenu', classTransition, classState]"
      :style="{
         '--halfWidth': `${halfWidth}px`,
         '--halfHeight': `${halfHeight}px`,
         '--startX': `${startX}px`,
         '--startY': `${startY}px`,
         '--endX': `${endX}px`,
         '--endY': `${endY}px`,
         '--moveY': `${moveY}em`,
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
            <img
               v-if="menu.icon"
               :src="menu.icon"
               :alt="`Icon ${menu.title}`"
            />
            <span>{{ menu.title }}</span>
         </button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PopupMenu {
      position: absolute;
      display: flex;
      overflow: hidden;
      top: 0;
      left: 0;

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
   }
   .PopupMenu-isShowing {
      opacity: 1;
      transform: translateX(var(--endX)) translateY(var(--endY));
   }
   .PopupMenu-isHiding {
      opacity: 0;
      transform: translateX(var(--startX))
         translateY(calc(var(--startY) + var(--moveY)));
   }
</style>
