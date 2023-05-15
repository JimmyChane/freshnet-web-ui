<script>
   import U from "@/U";
   export default {
      props: {
         item: { type: Object, default: () => {} },
      },
      computed: {
         actions: (c) => U.optArray(c.item.actions),
         parsed_actions: (c) => {
            return c.actions.filter((action) => c.actions.indexOf(action) < 2);
         },
      },
   };
</script>

<template>
   <div
      :class="[
         `Snackbar-${item.isShowing ? 'isShowing' : 'isHiding'}`,
         'Snackbar',
         'transition',
      ]"
      :style="{ '--index': item.index }"
   >
      <div class="Snackbar-body transition">
         <div class="Snackbar-background transition"></div>

         <div class="Snackbar-header" v-if="item.icon || item.isLoading">
            <img
               class="Snackbar-icon"
               :class="[item.isLoading ? 'Snackbar-icon-isLoading' : '']"
               v-if="item.icon"
               :src="item.icon"
            />
            <img
               class="Snackbar-loading"
               v-if="item.isLoading"
               :src="host.icon('loading-circular-FFFFFF')"
            />
         </div>

         <span class="Snackbar-text transition" v-if="item.text">{{ item.text }}</span>

         <button
            class="Snackbar-action transition"
            v-for="action of parsed_actions"
            :key="action.key"
            @click="action.click()"
         >
            {{ action.title }}
         </button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .Snackbar {
      --index: 0;

      --padding: 0.2em;
      --height: 2.8em;
      --absolute-height: calc(var(--height) + var(--padding) + var(--padding));

      position: absolute;
      bottom: 0;
      bottom: calc(var(--absolute-height) * var(--index));

      opacity: 0;
      width: 30em;
      max-width: 100%;
      padding: 0.2em;
      border-radius: 0.4rem;

      display: flex;
      flex-direction: column;
      align-items: center;

      .Snackbar-body {
         position: relative;
         width: 100%;
         display: flex;
         flex-direction: row;
         align-items: center;

         .Snackbar-background {
            z-index: 1;
            position: absolute;
            min-width: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            box-shadow: 0.1rem 0.3rem 0.6rem hsla(0, 0%, 30%, 0.4);
            background: hsla(0, 0%, 0%, 0.9);
            backdrop-filter: blur(0.4rem);
            border-radius: 0.4rem;

            border: 0.1rem solid hsla(0, 0%, 40%, 0.4);
         }
         .Snackbar-header {
            z-index: 2;
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            margin-left: 1rem;

            display: flex;
            align-items: center;
            justify-content: center;
            .Snackbar-icon {
               z-index: 1;
               position: absolute;
               width: 1.2rem;
               height: 1.2rem;
            }
            .Snackbar-icon-isLoading {
               transform: scale(0.7);
            }
            .Snackbar-loading {
               z-index: 2;
               position: absolute;
               width: 1.5rem;
               height: 1.5rem;
               animation: spinning linear 0.7s infinite;
            }
            @keyframes spinning {
               from {
                  transform: rotate(0deg);
               }
               to {
                  transform: rotate(360deg);
               }
            }
         }
         .Snackbar-text {
            z-index: 2;
            width: 100%;
            padding: 0.9rem 1.2rem;
            font-size: 1rem;
            text-align: center;
            text-align: start;
            line-height: 1.2;
            color: white;

            display: flex;
            flex-direction: column;
            align-items: center;
            align-items: flex-start;
         }
         .Snackbar-action {
            z-index: 2;
            height: 1.2rem;
            margin-right: 0.5rem;
            padding: 1rem;

            color: var(--accent-color);
            min-width: max-content;
            font-size: 0.8rem;
            font-weight: 600;
            background: none;
            border: none;
            border-radius: 0.2rem;
            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
               background: hsla(0, 0%, 100%, 0.08);
            }
         }
      }
   }
   .Snackbar-isShowing {
      bottom: calc(var(--absolute-height) * var(--index));
      opacity: 1;
   }
   .Snackbar-isHiding {
      opacity: 0;
   }
</style>
