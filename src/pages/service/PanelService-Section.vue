<script>
   import ButtonIcon from "@/components/button/ButtonIcon.vue";
   export default {
      components: { ButtonIcon },
      props: {
         title: { type: String, default: "" },
         menus: { default: () => [] },
      },
      computed: {
         theMenus: (c) => {
            if (Array.isArray(c.menus)) return c.menus;
            if (typeof c.menus === "object") return [c.menus];
            return [];
         },

         hasTitle: (c) => c.title.length > 0,
         hasMenus: (c) => c.theMenus.length > 0,
      },
   };
</script>

<template>
   <div
      :class="[
         'PanelService-section',
         !hasTitle && hasMenus
            ? 'PanelService-section-body-isHorizontal'
            : 'PanelService-section-body-isVertical',
      ]"
   >
      <div class="PanelService-section-body">
         <div class="PanelService-section-header" v-if="hasTitle || hasMenus">
            <div class="PanelService-section-title" v-if="hasTitle">{{ title }}</div>

            <div class="PanelService-section-menus" v-if="hasMenus">
               <ButtonIcon
                  v-for="menu of theMenus"
                  :key="menu.title"
                  :src="menu.icon"
                  @click="() => menu.click()"
               />
            </div>
         </div>

         <div class="PanelService-section-main"><slot /></div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelService-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      .PanelService-section-body {
         width: 100%;
         display: flex;
         align-items: flex-start;
         justify-content: flex-start;

         background: hsla(0, 0%, 100%, 0.5);
         border-bottom: 1px solid rgba(0, 0, 0, 0.15);
         .PanelService-section-header {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-start;
            justify-content: space-between;
            min-height: 1.8rem;

            .PanelService-section-title {
               text-align: start;
               font-weight: 600;
               flex-grow: 1;
               font-size: 0.9rem;
               color: hsl(0, 0%, 0%);
               padding: 1rem;
               padding-bottom: 0.4rem;
            }
            .PanelService-section-menus {
               width: max-content;
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: flex-end;
               margin-top: 0.2rem;
               margin-right: 0.2rem;
            }
         }
         .PanelService-section-main {
            width: 100%;
            padding: 1rem;
            padding-top: 0.4rem;
         }
      }
   }
   .PanelService-section-body-isVertical {
      .PanelService-section-body {
         flex-direction: column;

         .PanelService-section-header {
            width: 100%;
         }
      }
   }
   .PanelService-section-body-isHorizontal {
      .PanelService-section-body {
         flex-direction: row-reverse;
         .PanelService-section-header {
            .PanelService-section-menus {
               flex-direction: column;
               align-items: center;
            }
         }
         .PanelService-section-main {
            flex-grow: 1;
            padding-top: 0.8rem;
         }
      }
   }
</style>
