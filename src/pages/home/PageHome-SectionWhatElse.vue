<script>
   export default {
      props: { isThin: { type: Boolean, default: false } },
   };
</script>

<template>
   <div
      :class="[
         'HomeSectionWhatElse',
         `HomeSectionWhatElse-${isThin ? 'isThin' : 'isWide'}`,
      ]"
   >
      <div class="HomeSectionyHour-body">
         <span>Repair Laptop</span>
         <span>Repair Computer</span>
         <span>Repair Printer</span>
         <span>Modified Printer</span>
         <span>Refill Cartridge</span>
         <!-- <span>Internet Service</span> -->
         <span>Name Card Design</span>
         <span>Projector</span>
         <span>Typing</span>
         <!-- <span>Top-Up Handphone</span> -->
         <!-- <span>My Card</span> -->
         <span>CyberCafe (Internet & Browsing Only)</span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .HomeSectionWhatElse {
      background: white;
      overflow: hidden;
      color: black;

      border-radius: 1em;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .HomeSectionyHour-body {
         width: 100%;
         padding: 1.8em;
         gap: 0.8em;
         gap: 1em;
         line-height: 1em;

         display: grid;
         grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
         align-items: start;
         justify-content: start;
      }
   }
   .HomeSectionWhatElse-isThin {
      width: 100%;
      height: 100%;
      font-size: 1rem;
   }
   .HomeSectionWhatElse-isWide {
      width: 100%;
      height: 100%;
      font-size: 1.2rem;
   }
</style>
