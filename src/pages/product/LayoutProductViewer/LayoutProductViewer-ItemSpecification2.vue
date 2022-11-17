<script>
	export default {
		props: { productSpecification: Object, default: () => null },
		data() {
			return { title: "", icon: "", content: "" };
		},
		watch: {
			productSpecification() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.title = "";
				this.icon = "";
				this.content = "";

				const type = this.productSpecification
					? await this.productSpecification.fetchType()
					: null;

				this.title = type
					? type.title
					: this.parseKeyToTitle(this.productSpecification.type);
				this.icon = type && type.icon ? type.icon.toUrl() : "";
				this.content = this.productSpecification.content;
			},
			parseKeyToTitle(key = "") {
				if (key === "none") return "";

				return key.split(" ").reduce((title, text) => {
					let result = text.charAt(0).toUpperCase() + text.slice(1);
					return title === "" ? result : `${title} ${result}`;
				}, "");
			},
		},
	};
</script>

<template>
	<div class="ItemProductSpecification">
		<img
			class="ItemProductSpecification-icon"
			:style="{ opacity: icon ? '1' : '0' }"
			:src="icon"
		/>
		<div class="ItemProductSpecification-body">
			<span class="ItemProductSpecification-title">{{ title }}</span>
			<span class="ItemProductSpecification-content">{{ content }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemProductSpecification {
		width: 100%;
		max-width: 100%;
		display: flex;
		flex-direction: row;
		gap: 1.2rem;
		padding: 1.2rem;
		background: hsla(0, 0%, 100%, 0.6);

		.ItemProductSpecification-icon {
			width: 1.6rem;
			height: 1.6rem;
			padding: 0.2rem;
			object-fit: contain;
		}
		.ItemProductSpecification-body {
			width: 100%;
			flex-grow: 1;
			min-height: 2rem;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			line-height: 1.1;
			.ItemProductSpecification-title {
				display: flex;
				flex-direction: row;
				font-weight: 400;
				font-size: 0.7rem;
			}
			.ItemProductSpecification-content {
				font-weight: 600;
				height: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
			}
		}
	}
</style>
