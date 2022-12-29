<script>
	import Window from "@/components/window/Window.vue";
	import BelongingListEdit from "./BelongingListEdit.vue";

	export default {
		components: { Window, BelongingListEdit },
		emits: ["callback-cancel", "callback-change"],
		props: {
			values: { type: Array, default: () => [] },
		},
		methods: {
			onChange() {
				const belongings = this.$refs.BelongingListEdit.getResults();
				this.$emit("callback-change", belongings);
			},
			focus() {
				this.$refs.BelongingListEdit.focus();
			},
		},
	};
</script>

<template>
	<Window
		title="Edit Belongings"
		@click-cancel="$emit('callback-cancel')"
		@click-ok="onChange"
	>
		<BelongingListEdit
			class="WindowBelongings-list"
			:values="values"
			ref="BelongingListEdit"
		/>
	</Window>
</template>

<style lang="scss" scoped>
	.WindowBelongings-list {
		width: 35rem;
		max-width: 100%;
	}
</style>
