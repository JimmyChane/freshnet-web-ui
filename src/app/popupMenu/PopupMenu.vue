<script>
import chroma from 'chroma-js';

import { isFunction } from '@/U';

import Item from './PopupMenu-Item.vue';
import PopupMenuOption from './PopupMenuOption';

const Width = PopupMenuOption.Width;
const Corner = PopupMenuOption.Corner;
const Alignment = PopupMenuOption.Alignment;

export default {
  Width,
  Corner,
  Alignment,

  components: { Item },
  props: { popupMenu: { default: undefined } },
  data: (c) => ({
    width: 0,
    height: 0,
    halfWidth: 0,
    halfHeight: 0,
    x: 0,
    y: 0,
    classDirection: '',
    style: {},

    selfIsShowing: false,
    selfIsShown: false,

    classState: 'PopupMenu-isHiding', // will change
  }),
  computed: {
    isShowing: (c) => c.popupMenu.isShowing,
    anchor: (c) => c.popupMenu.anchor,
    menus: (c) => c.popupMenu.menus,
    option: (c) => c.popupMenu.option,

    preferWidth: (c) => c.option.width,
    corner: (c) => c.option.corner,
    alignment: (c) => c.option.alignment,
    primaryColor: (c) => {
      const primaryColor = c.option.primaryColor;
      if (primaryColor instanceof chroma.Color) {
        return primaryColor;
      }
      if (chroma.valid(primaryColor)) {
        return chroma(primaryColor);
      }
      return chroma('cccccc');
    },
    primaryColorBackground: (c) => c.primaryColor.mix('ffffff', 0.8),
    primaryColorBackgroundHover: (c) => c.primaryColor.mix('ffffff', 0.6),
    primaryColorBackgroundSelected: (c) => c.primaryColor.mix('ffffff', 0.4),
    textAlign: (c) => {
      if (c.menus.length > 1) return 'start';
      if (c.menus.length === 1 && c.menus[0].icon) return 'start';
      return 'center';
    },
  },
  watch: {
    isShowing() {
      this.invalidateShowing();
    },
  },
  created() {
    const rect = this.anchor.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.halfWidth = rect.width / 2;
    this.halfHeight = rect.height / 2;

    this.calculateCorner(this.corner, rect);

    this.style = {
      '--x': `${this.x}px`,
      '--y': `${this.y}px`,
      '--width': `${this.width}px`,
      '--height': `${this.height}px`,
      '--halfWidth': `${this.halfWidth}px`,
      '--halfHeight': `${this.halfHeight}px`,
      '--primary-color-background': this.primaryColorBackground,
      'text-align': this.textAlign,
      'pointer-events': 'none',
    };

    switch (this.preferWidth) {
      case Width.MIN:
        this.style['min-width'] = 'min-content';
        this.style['width'] = 'min-content';
        break;
      case Width.MAX:
        this.style['min-width'] = `${this.width}px`;
        this.style['width'] = 'max-content';
        break;
      case Width.SAME:
        this.style['min-width'] = `${this.width}px`;
        this.style['width'] = `${this.width}px`;
        break;
    }
  },
  mounted() {
    this.show();
  },
  methods: {
    calculateCorner(corner, rect) {
      switch (corner) {
        case Corner.TOP:
          this.classDirection = 'PopupMenu-Top';
          this.x = rect.left + this.halfWidth;
          this.y = rect.top;
          break;
        case Corner.RIGHT:
          this.classDirection = 'PopupMenu-Right';
          this.x = rect.left + this.width;
          this.y = rect.top + this.halfHeight;
          break;
        case Corner.BOTTOM:
          this.classDirection = 'PopupMenu-Bottom';
          this.x = rect.left + this.halfWidth;
          this.y = rect.top + this.height;
          break;
        case Corner.LEFT:
          this.classDirection = 'PopupMenu-Left';
          this.x = rect.left;
          this.y = rect.top + this.halfHeight;
          break;
        case Corner.TOP_LEFT:
          this.classDirection = 'PopupMenu-TopLeft';
          this.x = rect.left;
          this.y = rect.top;
          break;
        case Corner.TOP_RIGHT:
          this.classDirection = 'PopupMenu-TopRight';
          this.x = rect.left + this.width;
          this.y = rect.top;
          break;
        case Corner.BOTTOM_LEFT:
          this.classDirection = 'PopupMenu-BottomLeft';
          this.x = rect.left;
          this.y = rect.top + this.height;
          break;
        case Corner.BOTTOM_RIGHT:
          this.classDirection = 'PopupMenu-BottomRight';
          this.x = rect.left + this.width;
          this.y = rect.top + this.height;
          break;
        default:
        case Corner.AUTO:
          const screenWidthHalf = window.innerWidth / 2;
          const screenHeightHalf = window.innerHeight / 2;

          let vertical;
          let horizontal;

          switch (this.alignment) {
            case Alignment.VERTICAL:
              vertical =
                rect.top > screenHeightHalf ? Corner.TOP : Corner.BOTTOM;
              break;
            case Alignment.HORIZONTAL:
              horizontal =
                rect.left > screenWidthHalf ? Corner.LEFT : Corner.RIGHT;
              break;
            default:
            case Alignment.AUTO:
            case Alignment.DIANGLE:
              vertical =
                rect.top > screenHeightHalf ? Corner.TOP : Corner.BOTTOM;
              horizontal =
                rect.left > screenWidthHalf ? Corner.LEFT : Corner.RIGHT;
              break;
          }

          if (vertical === Corner.TOP && horizontal === undefined) {
            return this.calculateCorner(Corner.TOP, rect);
          }
          if (vertical === Corner.BOTTOM && horizontal === undefined) {
            return this.calculateCorner(Corner.BOTTOM, rect);
          }
          if (vertical === undefined && horizontal === Corner.LEFT) {
            return this.calculateCorner(Corner.LEFT, rect);
          }
          if (vertical === undefined && horizontal === Corner.RIGHT) {
            return this.calculateCorner(Corner.RIGHT, rect);
          }
          if (vertical === Corner.TOP && horizontal === Corner.LEFT) {
            return this.calculateCorner(Corner.TOP_LEFT, rect);
          }
          if (vertical === Corner.TOP && horizontal === Corner.RIGHT) {
            return this.calculateCorner(Corner.TOP_RIGHT, rect);
          }
          if (vertical === Corner.BOTTOM && horizontal === Corner.LEFT) {
            return this.calculateCorner(Corner.BOTTOM_LEFT, rect);
          }
          if (vertical === Corner.BOTTOM && horizontal === Corner.RIGHT) {
            return this.calculateCorner(Corner.BOTTOM_RIGHT, rect);
          }

          break;
      }
    },

    invalidateShowing() {
      this.isShowing ? this.show() : this.hide();
    },
    show() {
      if (this.selfIsShown && this.selfIsShowing) {
        return;
      }

      window.addEventListener('scroll', this.hide, true);
      this.selfIsShowing = true;
      setTimeout(() => {
        this.selfIsShowing = false;
        this.selfIsShown = true;
        this.style['pointer-events'] = 'initial';
      }, 1);
    },
    hide(e) {
      if (!this.selfIsShown) {
        return;
      }
      if (e?.target === this.$refs.scroll) {
        return;
      }

      this.popupMenu.hide();
      this.selfIsShown = false;
      window.removeEventListener('scroll', this.hide, true);
      this.style['pointer-events'] = 'none';
    },
    clickMenu(menu) {
      if (isFunction(menu.click)) {
        menu.click(menu);
        this.hide();
      }
    },
  },
};
</script>

<template>
  <div
    :class="['PopupMenu', 'transition', classDirection]"
    :style="style"
    :isShowing="`${selfIsShown}`"
  >
    <div class="PopupMenu-scroll scrollbar" ref="scroll">
      <Item
        class="transition"
        v-for="menu of menus"
        :key="menu.key"
        :menu="menu"
        :primaryColorBackgroundHover="primaryColorBackgroundHover"
        :primaryColorBackgroundSelected="primaryColorBackgroundSelected"
        @click="(menu) => clickMenu(menu)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PopupMenu {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;

  min-width: 10em;
  width: max-content;
  height: max-content;
  max-height: 20em;
  text-align: center;

  border-radius: 1em;
  box-shadow: 0.1em 0.2em 1em hsla(0, 0%, 0%, 0.4);
  box-shadow: 0 0 2em hsla(0, 0%, 0%, 0.4);
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
    height: 100%;
    max-height: 100%;

    overflow-x: hidden;
    overflow-y: auto;
    --scrollbar-size: 0.4em;
    --scrollbar-thumb-radius: 0.4em;
    --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
    --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
    --scrollbar-track-margin: var(--padding-horizontal);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    background: var(--primary-color-background);
  }

  position: absolute;
  top: var(--y);
  left: var(--x);
}

.PopupMenu[isShowing='true'] {
  opacity: 1;
  transform: var(--transform-end);
}
.PopupMenu[isShowing='false'] {
  opacity: 0;
  transform: var(--transform-start);
}

.PopupMenu-Top {
  --transform-start: translateX(calc(0px - 50%))
    translateY(calc(0px - 100% + var(--halfHeight)));
  --transform-end: translateX(calc(0px - 50%)) translateY(calc(0px - 100%));
}
.PopupMenu-Right {
  --transform-start: translateX(calc(0px - var(--halfWidth)))
    translateY(calc(0px - 50%));
  --transform-end: translateX(calc(0px)) translateY(calc(0px - 50%));
}
.PopupMenu-Bottom {
  --transform-start: translateX(calc(0px - 50%))
    translateY(calc(0px - var(--halfHeight)));
  --transform-end: translateX(calc(0px - 50%)) translateY(0px);
}
.PopupMenu-Left {
  --transform-start: translateX(calc(0px - 100% + var(--halfWidth)))
    translateY(calc(0px - 50%));
  --transform-end: translateX(calc(0px - 100%)) translateY(calc(0px - 50%));
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
