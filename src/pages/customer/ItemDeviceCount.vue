<script>
	import LabelCount from "@/components/LabelCount.vue";

	export default {
		components: { LabelCount },
		props: {
			categoryKey: { type: String, default: "" },
			count: { type: Number, default: 0 },
		},
		data() {
			return { category: null };
		},
		watch: {
			categoryKey() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.category = null;
				this.category = await this.categoryStore.dispatch(
					"getItemOfKey",
					this.categoryKey,
				);
			},
		},
	};
</script>

<template>
	<LabelCount :icon="category ? category.icon.toUrl() : ''" :count="count" />
</template>
