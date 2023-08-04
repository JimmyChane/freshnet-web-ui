<script>
   import U from "@/U";
   import LeftNavGroup2 from "./NavigationLeft-Group2.vue";
   import LeftNavLink from "./NavigationLeft-Link.vue";

   export default {
      components: { LeftNavGroup2, LeftNavLink },
      props: {
         group1: { type: Object, default: () => null },
      },
      computed: {
         group2s: (c) => U.optArray(c.group1.groups),
         hasGroup2s: (c) => c.group2s.length > 0,

         isExpanded: (c) => c.group1.isExpanded(),
         isSelected: (c) => c.group1.isSelected(),
         isWide: (c) => c.group1.isWide(),
      },
   };
</script>

<template>
   <div
      :class="[
         'LeftNavGroup1',
         `LeftNavGroup1-${isWide ? 'isWide' : 'isThin'}`,
         `LeftNavGroup1-${isWide ? 'isWide' : 'isThin'}-${
            hasGroup2s ? 'hasGroup2s' : 'noSections'
         }`,
         `LeftNavGroup1-${isWide ? 'isWide' : 'isThin'}-${
            isSelected ? 'isSelected' : 'notSelected'
         }`,
         `LeftNavGroup1-${isWide ? 'isWide' : 'isThin'}-${
            hasGroup2s && isSelected
               ? 'hasSectionsAndIsSelected'
               : 'hasNoSectionsAndIsSelected'
         }`,
         `LeftNavGroup1-${isExpanded ? 'isExpanded' : 'isNotExpanded'}`,
         'transition',
      ]"
   >
      <LeftNavLink
         class="LeftNavGroup1-header"
         :item="group1"
         :href="`/${group1.key}`"
         :isSelectedDark="!hasGroup2s"
         :hasGroup2s="hasGroup2s"
         @click="() => group1.click()"
         @click-open="() => group1.clickExpand()"
      />

      <div class="LeftNavGroup1-group2s" v-if="hasGroup2s">
         <div
            class="LeftNavGroup1-sectionParent"
            v-for="(group2, index) in group2s"
            :key="group2.key"
         >
            <LeftNavGroup2 :group2="group2" />
            <div
               class="LeftNavGroup1-sectionParent-line"
               v-if="index < group2s.length - 1"
            ></div>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
   .LeftNavGroup1 {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .LeftNavGroup1-group2s {
         display: flex;
         flex-direction: column;
         align-items: stretch;
         justify-content: flex-start;
         padding-top: 0.4em;
         padding-bottom: 0.4em;

         .LeftNavGroup1-sectionParent {
            display: flex;
            flex-direction: column;
            align-items: center;
            .LeftNavGroup1-sectionParent-line {
               width: calc(100% - 1.2rem);
               min-height: 1px;
               background: var(--primary-color);
               opacity: 0.2;
               margin: 0.8rem 0;
            }
         }
      }
   }

   .LeftNavGroup1-hasNoSectionsAndIsSelected {
      .LeftNavGroup1-group2s {
         display: none;
      }
   }

   .LeftNavGroup1-isExpanded {
      .LeftNavGroup1-group2s {
         display: flex;
         background: white;
      }
   }
   .LeftNavGroup1-isNotExpanded {
      .LeftNavGroup1-group2s {
         display: none;
      }
   }

   .LeftNavGroup1-isWide {
      &-hasGroup2s {
         border-radius: 0.5rem;
         width: calc(100% - 1em);
         margin: 0 0.5em;
         .LeftNavGroup1-header {
            --primary-color: #abbec9;
         }
         .LeftNavGroup1-group2s {
            background: white;
         }
      }
      &-noSections {
         border-radius: 0;
         .LeftNavGroup1-group2s {
            background: none;
         }
      }

      &-isSelected {
         width: 100%;
         border-radius: 0.5rem;
         margin: 0;
         .LeftNavGroup1-header {
            border-radius: 0;
         }
         .LeftNavGroup1-group2s {
            display: flex;
         }
      }
      &-notSelected {
         width: 100%;
         margin: 0;
         border-radius: 0.5rem;
         .LeftNavGroup1-group2s {
            background: none;
            padding: 0.8em;
            display: none;
         }
      }

      &-hasNoSectionsAndIsSelected {
         .LeftNavGroup1-group2s {
            display: none;
         }
      }
   }
   .LeftNavGroup1-isThin {
      .LeftNavGroup1-group2s {
         gap: 0;
      }

      &-hasGroup2s {
         border-radius: 0.5rem;
         .LeftNavGroup1-header {
            --primary-color: #abbec9;
            border-radius: 50%;
            border-radius: 0;
         }
         .LeftNavGroup1-group2s {
            background: white;
         }
      }
      &-noSections {
         border-radius: 0;
         background: none;
         .LeftNavGroup1-header {
            border-radius: 50%;
            border-radius: 0;
         }
      }

      &-isSelected {
         width: 100%;
         .LeftNavGroup1-group2s {
            display: flex;
         }
      }
      &-notSelected {
         width: min-content;
         border-radius: 0.5rem;
         align-items: center;
         justify-content: center;
         .LeftNavGroup1-group2s {
            padding: 0.8em;
            display: none;
            background: none;
         }
      }

      &-hasSectionsAndIsSelected {
         .LeftNavGroup1-header {
            border-radius: 0;
            width: 100%;
         }
      }
      &-hasNoSectionsAndIsSelected {
         .LeftNavGroup1-header {
            border-radius: 50%;
            border-radius: 0;
         }
         .LeftNavGroup1-group2s {
            display: none;
         }
      }
   }
</style>
