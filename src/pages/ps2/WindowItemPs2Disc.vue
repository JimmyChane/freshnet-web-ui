<script>
   export default {
      props: {
         item: { type: Object, default: () => null },
      },
      computed: {
         imageUrl: (c) => (c.code ? `ps2/disc/${c.code}.jpg` : ""),
         code: (c) => c.item?.code ?? "",
         title: (c) => c.item?.title ?? "",
      },
   };
</script>

<template>
   <div class="WindowItemPs2Disc">
      <img
         class="WindowItemPs2Disc-img"
         :src="host.cloudinary({ url: imageUrl })"
      />

      <div class="WindowItemPs2Disc-text">
         <span class="WindowItemPs2Disc-title">{{ title }}</span>
         <span class="WindowItemPs2Disc-code">{{ code }}</span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .WindowItemPs2Disc {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background: linear-gradient(180deg, #ffffff 0%, hsl(231, 24%, 46%) 100%);

      .WindowItemPs2Disc-img {
         width: 100%;
      }

      .WindowItemPs2Disc-text {
         display: flex;
         flex-direction: column;
         padding: 2em;
         gap: 0.4em;
         .WindowItemPs2Disc-title {
            font-size: 3em;
         }
         .WindowItemPs2Disc-code {
            width: fit-content;
            background: rgba(255, 255, 255, 0.5);
            padding: 0.2em 1em;
            font-weight: 600;
            font-size: 0.9em;
            border-radius: 0.2em;
         }
      }
   }
</style>
