<script>
   import Bottomsheet from "@/components/window/BottomsheetWindow.vue";
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import ImageView from "@/components/ImageView.vue";

   export default {
      components: { Bottomsheet, Actionbar, ImageView },
      data: (c) => ({
         containerWidth: 0,
         containerHeight: 0,
         containerMiddleX: 0,
         containerMiddleY: 0,

         isZoomedIn: false,
         isHovering: false,
         minZoomScale: 1,
         maxZoomScale: 4,
         translateY: 0,
         translateX: 0,
      }),
      computed: {
         isShowing: (c) => c.store.getters.imageViewer.isShowing,
         image: (c) => c.store.getters.imageViewer.image,
         thumbnails: (c) => c.store.getters.imageViewer.thumbnails,

         style() {
            const transforms = [
               this.isZoomedIn
                  ? `scale(${this.maxZoomScale})`
                  : `scale(${this.minZoomScale})`,
            ];
            if (this.isZoomedIn) {
               transforms.push(`translateX(${this.translateX}px)`);
               transforms.push(`translateY(${this.translateY}px)`);
            }

            const style = {};
            if (this.isHovering) style["transition"] = "none";
            style["transform"] = transforms.reduce((str, transform, i, arr) => {
               if (i === 0) return transform;
               if (i < arr.length) return `${str} ${transform}`;
            });
            style["cursor"] = this.isZoomedIn ? "zoom-out" : "zoom-in";
            if (this.isHovering) style["pointer-events"] = "none";
            return style;
         },
      },
      watch: {
         isShowing() {
            if (this.isShowing) this.isZoomedIn = false;
         },
         isHovering() {
            if (!this.isHovering) this.isZoomedIn = false;
         },
      },
      methods: {
         clickDismiss() {
            this.store.dispatch("imageViewerHide");
         },
         invalidateContainerSize() {
            const { Container } = this.$refs;

            if (!Container) {
               window.removeEventListener("resize", this.invalidateContainerSize);
               return;
            }

            this.containerWidth = Container.offsetWidth;
            this.containerHeight = Container.offsetHeight;

            this.containerMiddleX = this.containerWidth / 2;
            this.containerMiddleY = this.containerHeight / 2;
         },

         onMouseMove(e) {
            const { offsetX, offsetY } = e;

            if (this.isZoomedIn) this.isHovering = true;

            this.translateX = this.containerMiddleX - offsetX;
            this.translateY = this.containerMiddleY - offsetY;
         },
         onMouseLeave() {
            this.isHovering = false;
         },
         onClickImage() {
            this.isZoomedIn = !this.isZoomedIn;
         },
         onClickContainer() {
            if (this.isHovering) this.isHovering = false;
         },
      },
      mounted() {
         this.invalidateContainerSize();
         window.addEventListener("resize", this.invalidateContainerSize);
      },
   };
</script>

<template>
   <div class="App-overflow">
      <div class="App-overflow-body">
         <Bottomsheet
            class="ViewerImage"
            :isShowing="isShowing"
            @click-dismiss="() => clickDismiss()"
            :style="{
               '--thumbnails-height': thumbnails.length > 1 ? '5rem' : '0',
            }"
         >
            <div class="ViewerImage-body">
               <Actionbar
                  class="ViewerImage-actionbar"
                  :leftMenus="{
                     icon: host.icon('close-000000'),
                     click: () => clickDismiss(),
                  }"
               />

               <div
                  class="ViewerImage-main"
                  :style="{
                     height:
                        thumbnails.length > 1
                           ? 'calc(100% - var(--thumbnails-height))'
                           : '100%',
                  }"
                  ref="Container"
                  @mousemove="(e) => onMouseMove(e)"
                  @mouseleave="(e) => onMouseLeave(e)"
                  @click="() => onClickContainer()"
               >
                  <ImageView
                     class="ViewerImage-image"
                     ref="image"
                     v-if="image"
                     :src="image"
                     :resize="false"
                     :style="style"
                     @click="() => onClickImage()"
                  />
               </div>

               <div class="ImageView-footer" v-if="thumbnails.length > 1">
                  <div class="ImageView-images scrollbar">
                     <button
                        :class="[
                           thumbnail === image
                              ? 'ImageView-images-item-button-isSelected'
                              : 'ImageView-images-item-button-isDeselected',
                           'ImageView-images-item-button',
                           'transition',
                        ]"
                        v-for="thumbnail of thumbnails"
                        :key="thumbnail.toUrl()"
                        @click="() => store.dispatch('imageViewerSelect', thumbnail)"
                     >
                        <ImageView class="ImageView-images-item" :src="thumbnail" />
                     </button>
                  </div>
               </div>
            </div>
         </Bottomsheet>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .App-overflow {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100dvw;
      height: 100dvh;
      display: flex;
      overflow: hidden;

      .App-overflow-body {
         position: relative;
         width: 100dvw;
         height: 100dvh;
         display: flex;
         overflow: hidden;

         .ViewerImage {
            z-index: 3;
         }
      }

      .ViewerImage {
         --default-size-top: 0;
         --default-size-right: 0;
         --default-size-bottom: 0;
         --default-size-left: 0;

         --actionbar-height: 5rem;
         --thumbnails-height: 5rem;
         --thumbnail-height: 4.2rem;

         .ViewerImage-body {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background-color: hsla(0, 0%, 100%, 0.5);
            .ViewerImage-actionbar {
               z-index: 1;
               background: none;
               color: black;
               height: var(--actionbar-height);
            }
            .ViewerImage-main {
               z-index: 2;
               width: 100dvw;
               max-width: 100%;
               max-height: calc(100% - var(--thumbnail-height) - var(--actionbar-height));
               padding: 1rem;
               flex-grow: 1;

               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;

               .ViewerImage-image {
                  max-width: 100%;
                  max-height: 100%;
                  border-radius: 0.5rem;
                  object-fit: contain;
                  background-color: rgba(255, 255, 255, 0.9);
               }
            }
            .ImageView-footer {
               z-index: 1;
               height: var(--thumbnails-height);
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: center;

               .ImageView-images {
                  width: max-content;
                  max-width: 100%;
                  height: var(--thumbnails-height);
                  overflow-y: auto;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  align-items: flex-start;
                  justify-content: flex-start;
                  gap: 0.5rem;

                  .ImageView-images-item-button {
                     height: var(--thumbnail-height);
                     background: none;
                     border: none;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     border-radius: 0.2rem;
                     overflow: hidden;
                     padding: 0.2rem;
                     .ImageView-images-item {
                        height: 100%;
                        width: 100%;
                        object-fit: contain;
                     }
                  }
                  .ImageView-images-item-button-isSelected {
                     background-color: var(--accent-color);
                  }
                  .ImageView-images-item-button-isDeselected {
                     cursor: pointer;
                     &:hover {
                        background-color: hsla(0, 0%, 0%, 0.1);
                     }
                  }
               }
            }
         }
      }
   }
</style>
