<script>
   export default { props: { isWide: { type: Boolean, default: false } } };
</script>

<template>
   <div
      :class="[
         'LeftNavHeader',
         isWide ? 'LeftNavHeader-isWide' : 'LeftNavHeader-isThin',
      ]"
   >
      <router-link class="LeftNavHeader-logo" :to="{ path: '/' }">
         <img
            class="LeftNavHeader-icon"
            :src="
               host.cloudinary({
                  url: 'logo/svg/freshnet-enterprise-logo.svg',
               })
            "
         />
         <span class="LeftNavHeader-title">Freshnet Enterprise</span>
      </router-link>

      <button
         class="LeftNavHeader-collapse"
         v-if="$root.navigation.isDrawer()"
         @click="() => $root.navigation.closeNavigationDrawer()"
      >
         <img :src="host.res('icon/arrowDown-000000.svg')" />
      </button>
   </div>
</template>

<style lang="scss" scoped>
   .LeftNavHeader {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0.4rem;

      .LeftNavHeader-logo {
         gap: 0.5rem;
         padding: 1rem;

         display: flex;
         flex-direction: row;
         align-items: center;
         justify-content: center;

         cursor: pointer;
         text-decoration: none;
         color: var(--primary-color);
         transition: var(--transition-duration);
         background: none;

         &:hover {
            text-decoration: underline;
         }

         .LeftNavHeader-icon {
            transition: var(--transition-duration);
         }
         .LeftNavHeader-title {
            font-weight: 600;
            line-height: 1;
            color: black;
         }
      }
      .LeftNavHeader-collapse {
         background: none;
         border: none;
         border-radius: 50%;
         padding: 0.8rem;
         display: flex;
         align-items: center;
         justify-content: center;
         cursor: pointer;
         img {
            padding: 0.5rem;
            width: 2rem;
            height: 2rem;
            transition: var(--transition-duration);
         }
         img {
            transform: rotate(90deg);
         }
         &:hover {
            img {
               transform: scale(0.9) rotate(90deg);
            }
         }
      }
   }
   .LeftNavHeader-isWide {
      .LeftNavHeader-logo {
         .LeftNavHeader-icon {
            width: 2rem;
            height: 2rem;

            width: 1.8rem;
            height: 1.8rem;
         }
      }
   }
   .LeftNavHeader-isThin {
      gap: 0.5rem;
      .LeftNavHeader-logo {
         .LeftNavHeader-icon {
            width: 1.3rem;
            height: 1.3rem;
         }
         .LeftNavHeader-title {
            display: none;
         }
      }
   }
</style>
