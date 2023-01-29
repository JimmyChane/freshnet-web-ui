<script>
   import Actionbar from "@/components/actionbar/Actionbar.vue";
   import Footer from "@/app/footer/Footer.vue";

   export default {
      rtitle: "Page Not Found",
      components: { Actionbar, Footer },
      data() {
         return { drawer: { isExpand: false }, top: { shadow: false } };
      },
   };
</script>

<template>
   <div
      class="Page404"
      @scroll="(event) => (top.shadow = event.target.scrollTop > 0)"
   >
      <Actionbar
         :class="['Home-top', top.shadow ? 'Home-top-shadow' : '']"
         v-if="$root.navigation.isDrawer()"
         :leftMenus="[
            {
               key: 'home',
               title: 'Home',
               icon: this.host.res('img/freshnet-enterprise-logo.svg'),
               click: () => this.$router.push('/home'),
            },
            {
               title: 'Hamburger Menu',
               icon: host.res('icon/hamburgerMenu-000000.svg'),
               click: () => $root.navigation.openNavigationDrawer(),
            },
         ]"
      />

      <div class="Page404-main">
         <span class="Page404-title">404</span>
         <p class="Page404-description"
            >The page you're looking for cannot be found</p
         >

         <router-link class="Page404-goBack" :to="{ path: '/' }"
            >Go Back</router-link
         >
      </div>

      <Footer />
   </div>
</template>

<style lang="scss" scoped>
   .Page404 {
      color: #000000;

      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: stretch;
      position: relative;

      .Page404-body {
         z-index: 1;
         width: 100%;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: flex-start;
         position: relative;
         overflow-x: hidden;
         overflow-y: auto;
      }

      .Home-top {
         top: 0;
         right: 0;
         left: 0;
         width: 100%;
         position: sticky;
         flex-grow: 0;
         transition: var(--transition-duration);

         .Home-top-body {
            width: 100%;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            column-gap: 1rem;

            .Login-top-logo {
               --size: 2.8rem;

               width: var(--size);
               height: var(--size);
               min-width: var(--size);
               min-height: var(--size);
               max-width: var(--size);
               max-height: var(--size);
               background: none;
               border: none;
               cursor: pointer;
               padding: 0.6rem;
               border-radius: 50%;
               transition: var(--transition-duration);
               display: flex;
               flex-grow: 0;
               flex-direction: row;
               align-items: center;
               justify-content: center;

               &:hover {
                  background: hsla(0, 0%, 0%, 0.1);
                  background: #49748940;
               }
               &-img {
                  height: 100%;
                  width: 100%;
               }
            }
         }
      }
      .Home-top-shadow {
         box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
      }

      .Page404-main {
         z-index: 1;
         width: 100%;
         max-width: 35rem;
         padding: 1.4rem;

         display: flex;
         flex-direction: column;
         flex-grow: 1;
         align-items: flex-start;
         justify-content: center;

         .Page404-title {
            font-size: 4rem;
            opacity: 0.6;
            line-height: 1.4;
         }
         .Page404-description {
            font-weight: 400;
            font-size: 1.2rem;
         }
         .Page404-goBack {
            color: inherit;
            margin-top: 2rem;
         }
      }
   }
</style>
