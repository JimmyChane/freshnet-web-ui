<script>
	import Section from "./PageHome_Section.vue";
	import Item from "./PageHome_SectionCategory-item.vue";
	export default {
		components: { Section, Item },
		props: { isThin: { type: Boolean, default: false } },
		data: () => ({ groups: [] }),
		watch: {
			"categoryStore.getters.lastModified"() {
				this.invalidate();
			},
			"productStore.getters.lastModified"() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.groups = [];
				const groups = await this.productStore.dispatch("getGroupsByCategory");
				groups.sort((group1, group2) => {
					return group1.category.compare(group2.category);
				});

				this.groups = groups;
			},
		},
	};
</script>

<template>
	<Section :isThin="isThin" title="Product We Sell">
		<div class="HomeSectionCategory-body">
			<Item
				v-for="group of groups"
				:key="group.category.id"
				:title="group.category.title"
				:count="group.items.length"
				:icon="group.category.icon ? group.category.icon.toUrl() : ''"
				:to="{ path: '/product', query: { category: group.category.id } }"
			/>
		</div>
	</Section>
</template>

<style lang="scss" scoped>
	.HomeSectionCategory-body {
		width: 100%;
		gap: 0.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
	}
</style>
