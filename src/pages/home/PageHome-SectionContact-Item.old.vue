<script>
   export default {
      props: {
         isThin: { type: Boolean, default: false },
         title: { type: String, default: "" },
         description: { type: String, default: "" },
         links: { type: Array, default: () => [] },
      },
      computed: {
         firstLink() {
            return this.links.length ? this.links[0] : null;
         },
         titleClick() {
            if (!this.firstLink) return "";
            return `Click to ${this.firstLink.title}`;
         },
         href() {
            if (this.firstLink) {
               return this.firstLink.href;
            }
         },
         target() {
            if (this.firstLink) return this.firstLink.target;
         },
      },
   };
</script>

<template>
   <a
      :class="['ContactItem', `ContactItem-${isThin ? 'isThin' : 'isWide'}`]"
      :href="href"
      :target="target"
   >
      <div class="ContactItem-main">
         <span class="ContactItem-title">{{ title }}</span>

         <span class="ContactItem-content">{{ description }}</span>

         <div class="ContactItem-icons" v-if="links.length">
            <a
               class="ContactItem-link"
               v-for="link of links"
               :key="link.title"
               :href="link.href"
               :target="link.target"
            >
               <img
                  class="ContactItem-icon"
                  :src="link.icon"
                  :alt="link.title"
               />
            </a>
         </div>
      </div>
   </a>
</template>

<style lang="scss" scoped>
   .ContactItem {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;

      border-radius: 0.5em;
      overflow: hidden;
      color: black;

      text-decoration: none;
      position: relative;
      transition: var(--transition-duration);
      aspect-ratio: 16/8;

      &:hover,
      &:focus {
         // transform: scale(1.05);
         box-shadow: 0px 0px 1.5rem hsla(0, 0%, 0%, 0.1);
      }

      .ContactItem-main {
         display: flex;
         flex-direction: column;
         flex-grow: 1;
         align-items: flex-start;
         justify-content: center;
         height: 100%;
         max-height: 12em;
         z-index: 2;
         padding: 0.8em;

         .ContactItem-title {
            font-weight: 600;
            font-size: 1.9em;

            font-size: 1em;
         }
         .ContactItem-content {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            font-size: 0.8em;
         }
         .ContactItem-icons {
            font-size: 1.5em;
            font-size: 1em;
            display: flex;
            flex-direction: row;
            align-items: center;

            .ContactItem-link {
               padding: 0.5em;
               display: flex;
               border-radius: 50%;
               border: 1px solid transparent;
               transition: var(--transition-duration);
               &:hover {
                  background-color: hsla(0, 0%, 0%, 0.05);
                  border: 1px solid hsla(0, 0%, 0%, 0.1);
               }
               .ContactItem-icon {
                  width: 1em;
                  height: 1em;
               }
            }
         }
      }
   }
   .ContactItem-isThin {
      font-size: 1rem;
   }
   .ContactItem-isWide {
      font-size: 1.3rem;
   }
</style>
