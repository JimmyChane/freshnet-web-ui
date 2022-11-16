<script>
	export default {
		props: { productSpecification: Object, default: () => null },
		computed: {
			specificationType() {
				if (!this.productSpecification)
					return this.productSpecification.unknownKey;
				return this.productSpecification.type;
			},
			specificationIcon() {
				if (!this.specificationType || !this.specificationType.icon) return "";
				return this.specificationType.icon.toUrl();
			},
			specificationTitle() {
				if (
					typeof this.specificationType === "object" &&
					this.specificationType !== null
				)
					return this.specificationType.title;
				if (typeof this.specificationType === "string")
					return this.parseKeyToTitle(this.specificationType);
				return "";
			},
			specificationContent: (c) => c.productSpecification.content,
		},
		methods: {
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
			:style="{ opacity: specificationIcon ? '1' : '0' }"
			:src="specificationIcon"
		/>
		<div class="ItemProductSpecification-body">
			<span class="ItemProductSpecification-title">{{
				specificationTitle
			}}</span>
			<span class="ItemProductSpecification-content">{{
				specificationContent
			}}</span>
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
