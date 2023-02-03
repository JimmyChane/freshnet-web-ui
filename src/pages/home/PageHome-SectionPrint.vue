<script>
   export default { props: { isThin: { type: Boolean, default: false } } };
</script>

<template>
   <router-link
      :class="[
         'HomeSectionPrint',
         `HomeSectionPrint-${isThin ? 'isThin' : 'isWide'}`,
      ]"
      :to="{ path: '/print' }"
   >
      <div class="HomeSectionPrint-main">
         <span class="HomeSectionPrint-title">Printing Service</span>
         <div class="HomeSectionPrint-content">
            <span>Photostat RM 0.10</span>
            <span>Print RM 0.50</span>
         </div>
         <span class="HomeSectionPrint-click">Click to View More</span>
      </div>

      <img
         class="HomeSectionPrint-img"
         :style="{ 'grid-area': 'img' }"
         :src="host.res('img/illustration-printing.png')"
      />
   </router-link>
</template>

<style lang="scss" scoped>
   .HomeSectionPrint {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      background: linear-gradient(101deg, #2a26d8 0%, #2d619d 100%);
      aspect-ratio: 16/7;
      border-radius: 1em;
      overflow: hidden;
      color: white;

      text-decoration: none;
      position: relative;
      transition: var(--transition-duration);

      &:hover,
      &:focus {
         box-shadow: 0px 0px 1.5rem #2d619d;
      }

      .HomeSectionPrint-main {
         display: flex;
         flex-direction: column;
         flex-grow: 1;
         align-items: flex-start;
         padding: 2em;
         height: 100%;
         max-height: 12em;
         gap: 0.5em;
         z-index: 2;

         .HomeSectionPrint-title {
            font-weight: 600;
            font-size: 1.9em;
         }
         .HomeSectionPrint-content {
            font-size: 0.8em;
            opacity: 0.7;
            display: flex;
            flex-flow: column nowrap;
         }
         .HomeSectionPrint-click {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            text-decoration: underline;
            font-size: 0.8em;
         }
      }
      .HomeSectionPrint-img {
         z-index: 1;
         height: calc(100% - 5em);
         aspect-ratio: 1/1;
         object-fit: cover;
         position: absolute;
         right: 0;
         top: 0;
         bottom: 0;
      }
   }
   .HomeSectionPrint-isThin {
      width: 100%;
      height: 100%;
      font-size: 0.8rem;
      .HomeSectionPrint-img {
         margin: 2.5em 2em 2.5em 0;
      }
   }
   .HomeSectionPrint-isWide {
      width: 100%;
      height: 100%;
      font-size: 1.2rem;
      .HomeSectionPrint-img {
         margin: 2.5em 2.5em 2.5em 0;
      }
   }
</style>
