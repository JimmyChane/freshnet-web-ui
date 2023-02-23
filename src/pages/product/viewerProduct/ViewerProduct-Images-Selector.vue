<script>
   export default {
      emits: ["click-file"],
   };
</script>

<template>
   <dir class="ProductViewerImageSelector">
      <div class="ProductViewerImageSelector-body transition">
         <div class="ProductViewerImageSelector-button">
            <img
               class="ProductViewerImageSelector-icon"
               :src="host.icon('add-000000')"
            />
         </div>

         <input
            class="ProductViewerImageSelector-input"
            type="file"
            accept=".jpeg, .jpg, .png, .webp"
            @change="
               (event) => {
                  const [file] = event.target.files;
                  if (file) {
                     $emit('click-file', file);
                  }
               }
            "
         />
      </div>
   </dir>
</template>

<style lang="scss" scoped>
   .ProductViewerImageSelector {
      --size: 3rem;
      @media (max-width: 480px) {
         --size: 2.9rem;
      }

      --box-padding: 0.18rem;

      --width: calc(var(--size) + var(--box-padding) + var(--box-padding));
      --height: calc(var(--size) + var(--box-padding) + var(--box-padding));

      width: var(--width);
      height: var(--height);
      min-width: var(--width);
      min-height: var(--height);

      display: flex;
      align-items: center;
      justify-content: center;

      .ProductViewerImageSelector-body {
         width: var(--size);
         height: var(--size);
         min-width: var(--size);
         min-height: var(--size);

         position: relative;
         background: hsla(0, 0%, 100%, 0.6);
         border-radius: 0.4rem;

         display: flex;
         align-items: center;
         justify-content: center;

         &:hover {
            background: hsla(0, 0%, 100%, 0.8);
         }

         .ProductViewerImageSelector-button {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            width: var(--size);
            height: var(--size);
            min-width: var(--size);
            min-height: var(--size);
            pointer-events: none;

            display: flex;
            align-content: center;
            justify-content: center;

            .ProductViewerImageSelector-icon {
               --size: 1em;
               width: var(--size);
               height: var(--size);
               @media (max-width: 480px) {
                  --size: 0.8em;
               }

               opacity: 0.6;
               margin: auto;

               display: flex;
               align-content: center;
               justify-content: center;
            }
         }

         .ProductViewerImageSelector-input {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            opacity: 0;

            width: var(--size);
            height: var(--size);
            min-width: var(--size);
            min-height: var(--size);
            cursor: pointer;
            border: none;
         }
      }
   }
</style>
