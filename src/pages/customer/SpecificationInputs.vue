<script lang="ts">
  import ItemSpec from "./ItemSpecificationInput.vue";
  import Selector4 from "@/components/selector/Selector4.vue";
  import Specification, { Type } from "@/items/Specification";
  import Vue from "vue";

  interface Menu {
    key: string;
    title: string;
    icon: string;
  }

  interface Data {
    list: { content: string; typeKey: string }[];
  }

  export default Vue.extend({
    components: { ItemSpec, Selector4 },
    props: {
      items: { type: Array as () => Specification[], default: () => [] },
    },
    data(): Data {
      return { list: [] };
    },
    computed: {
      KeyNone(): string {
        return "none";
      },
      SpecKeys(): string[] {
        return [
          this.KeyNone,
          ...Object.keys(Type.Key).map((key) => {
            return (Type.Key as Record<string, string>)[key];
          }),
        ];
      },
      SpecificationMenus(): Menu[] {
        return [
          { key: this.KeyNone, title: "None" },
          ...this.$store.state.stores.specification.getters.items,
        ]
          .map((item) => {
            return {
              key: item.key,
              title: item.title,
              icon: item.icon?.toUrl() ?? "",
            };
          })
          .filter((menu) => {
            if (menu.key === "none") return true;

            const dataSpecification = this.list.find((dataSpec) => {
              return dataSpec.typeKey === menu.key;
            });
            return !dataSpecification;
          })
          .sort((menu1, menu2) => {
            return (
              this.SpecKeys.indexOf(menu1.key) -
              this.SpecKeys.indexOf(menu2.key)
            );
          });
      },
    },
    watch: {
      items() {
        this.list = this.items;
      },
    },
    methods: {
      addItem(item: { content: string; typeKey: string }) {
        this.list.push(item);
      },
      removeItem(item: { content: string; typeKey: string }) {
        this.list.splice(this.list.indexOf(item), 1);
      },
    },
    mounted() {
      this.$store.state.stores.specification.dispatch("refresh");
    },
  });
</script>

<template>
  <div class="SpecificationInputs">
    <div class="SpecificationInputs-contents">
      <ItemSpec
        v-for="item in list"
        :key="item.key"
        :item="item"
        @input-content="(value) => (item.content = value)"
        @click-remove="(item) => removeItem(item)"
      />
    </div>
    <Selector4
      :menus="SpecificationMenus"
      @click-menu="(menu) => addItem({ content: '', typeKey: menu.key })"
    />
  </div>
</template>

<style lang="scss" scoped>
  .SpecificationInputs {
    display: flex;
    flex-direction: column;
    gap: 1em;
    --primary-color: hsl(0, 0%, 30%);
    .SpecificationInputs-contents {
      display: flex;
      flex-direction: column;
      gap: 0.3em;
    }
  }
</style>
