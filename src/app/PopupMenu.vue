<script>
   export default {
      data() {
         return {
            top: 0,
            left: 0,

            classTransition: "",
            classState: "",

            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            halfWidth: 0,
            halfHeight: 0,
         };
      },
      computed: {
         isShowing() {
            return this.$root.popupMenu.isShowing;
         },
         anchor() {
            return this.$root.popupMenu.anchor;
         },
         menus() {
            return this.$root.popupMenu.menus;
         },
      },
      watch: {
         anchor() {
            this.invalidate();
         },
      },
      mounted() {
         this.invalidate();
      },
      methods: {
         invalidate() {
            const { anchor } = this;

            if (anchor === null) {
               this.classState = "PopupMenu-isHiding";
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

            const { width, height } = screen;

            console.log({ width, height });

            const rect = anchor.getBoundingClientRect();
            this.halfWidth = rect.width / 2;
            this.halfHeight = rect.height / 2;
            this.startX = rect.left;
            this.startY = rect.top;
            this.endX = this.startX + this.halfWidth;
            this.endY = this.startY + this.halfHeight;
            this.classTransition = "transition";

            setTimeout(() => {
               this.classState = "PopupMenu-isShowing";
            }, 100);
         },
      },
   };
</script>

<template>
   <div
      :class="['PopupMenu', classTransition, classState]"
      :style="{
         '--startX': `${startX}px`,
         '--startY': `${startY}px`,
         '--endX': `${endX}px`,
         '--endY': `${endY}px`,
         '--halfWidth': `${halfWidth}px`,
         '--halfHeight': `${halfHeight}px`,
      }"
   >
      <div class="PopupMenu-scroll scrollbar">
         <button
            class="transition"
            v-for="menu of menus"
            :key="menu.key"
            @click="
               () => {
                  $root.popupMenuHide();
                  if (typeof menu.click === 'function') menu.click(menu);
               }
            "
         >
            <span>{{ menu.title }}</span>
         </button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PopupMenu {
      position: absolute;
      z-index: 5;
      display: flex;
      overflow: hidden;
      top: var(--startY);
      left: var(--startX);

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
            padding: 0.8em;

            background: none;
            border: none;
            font-size: 1em;
            cursor: pointer;

            &:hover {
               background: hsla(0, 0%, 0%, 0.1);
            }
         }
      }
   }
   .PopupMenu-isShowing {
      opacity: 1;
      transform: translateY(var(--halfHeight)) translateX(var(--halfWidth));
   }
   .PopupMenu-isHiding {
      opacity: 0;
      transform: translateY(0);
      pointer-events: none;
   }
</style>
