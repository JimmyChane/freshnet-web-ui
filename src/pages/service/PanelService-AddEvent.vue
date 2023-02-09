<script>
   import chroma from "chroma-js";
   import Menu from "@/components/Menu.vue";

   export default {
      components: { Menu },
      computed: {
         primaryColor: (c) => chroma("961d96"),
         primaryColor1: (c) => c.primaryColor.mix("ffffff", 0.4),
         primaryColor2: (c) => c.primaryColor.mix("ffffff", 0.6),
      },
   };
</script>

<template>
   <div
      class="PanelService-AddEvent"
      :style="{
         '--primary-color': primaryColor,
         '--primary-color-1': primaryColor1,
         '--primary-color-2': primaryColor2,
      }"
   >
      <span class="PanelService-AddEvent-header">13pm</span>

      <TextArea
         class="PanelService-AddEvent-description"
         ref="input"
         :isRequired="true"
         placeholder="Description"
      />

      <div class="PanelService-AddEvent-status">
         <div class="PanelService-AddEvent-status-header">
            <span class="PanelService-AddEvent-status-header-title">Info</span>
            <Menu
               :menus="[
                  { title: 'Quotation' },
                  { title: 'Price' },
                  { title: 'Info' },
               ]"
            >
               <span class="PanelService-AddEvent-status-header-arrow"
                  >arrow</span
               >
            </Menu>
         </div>
         <input
            class="PanelService-AddEvent-status-description"
            type="text"
            placeholder="Status"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .PanelService-AddEvent {
      width: 100%;
      display: flex;
      flex-direction: row;

      display: grid;
      grid-template-areas: "header status" "description status";
      grid-template-rows: max-content 1fr;
      grid-template-columns: 1fr max-content;

      background-color: var(--primary-color-2);
      border-radius: 0.5em;
      overflow: hidden;

      .PanelService-AddEvent-header {
         grid-area: header;
      }
      .PanelService-AddEvent-description {
         grid-area: description;
      }
      .PanelService-AddEvent-status {
         grid-area: status;
      }

      .PanelService-AddEvent-header {
         margin: 0 0.5rem;
         margin-top: 1rem;
         font-size: 0.8rem;
      }
      .PanelService-AddEvent-description {
         padding: 0.5rem;
         resize: none;
         background: none;
         border: none;

         &::placeholder {
            color: rgba(0, 0, 0, 0.4);
         }
      }
      .PanelService-AddEvent-status {
         display: flex;
         flex-direction: column;
         margin: 0.5rem;
         border-radius: 0.5rem;
         overflow: hidden;

         .PanelService-AddEvent-status-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: var(--primary-color);
            color: white;
            padding: 0.5em;
            font-size: 0.8rem;

            .PanelService-AddEvent-status-header-title {
               flex-grow: 1;
            }
            .PanelService-AddEvent-status-header-arrow {
            }
         }
         .PanelService-AddEvent-status-description {
            flex-grow: 1;
            background-color: var(--primary-color-1);
            text-align: center;
            border: none;
            height: 4rem;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            &::placeholder {
               color: rgba(0, 0, 0, 0.4);
            }
         }
      }
   }
</style>
