<script>
	import ProductSpecType from "@/items/ProductSpecType.js";
	import Item from "./PageProductExport-Layout-One-Specification.vue";
	import ProductPrice from "@/items/ProductPrice";

	export default {
		components: { Item },
		props: { product: { type: Object, default: () => null } },
		data() {
			return { fullTitle: "" };
		},
		computed: {
			user: (c) => c.loginStore.getters.user,
			isUserAdmin: (c) => (c.user ? c.user.isTypeAdmin() : false),
			isUserStaff: (c) => (c.user ? c.user.isTypeStaff() : false),
			allowEdit: (c) => c.isUserAdmin || c.isUserStaff,

			brandId: (c) => (c.product ? c.product.brandId : ""),

			specificationKeys: () => {
				return Object.keys(ProductSpecType.Key).map((key) => {
					return ProductSpecType.Key[key];
				});
			},
			specifications: (context) => {
				if (!context.product) return [];
				if (!Array.isArray(context.product.specifications)) return [];

				return context.product.specifications
					.filter((spec) => spec && spec.type && spec.content)
					.sort((spec1, spec2) => {
						const key1 = context.obtainKeyOfSpecificationType(spec1.type);
						const key2 = context.obtainKeyOfSpecificationType(spec2.type);

						let index1 = context.specificationKeys.indexOf(key1);
						let index2 = context.specificationKeys.indexOf(key2);

						index1 = index1 >= 0 ? index1 : context.specificationKeys.length;
						index2 = index2 >= 0 ? index2 : context.specificationKeys.length;

						return index1 !== index2
							? index1 - index2
							: key1.localeCompare(key2);
					});
			},

			productPrice() {
				if (!this.allowEdit) return null;
				if (!this.product) return null;
				return this.product.price;
			},
			productPriceNormal() {
				if (!this.productPrice) return new ProductPrice();
				if (!this.productPrice.normal) return new ProductPrice();
				return this.productPrice.normal;
			},
			productPricePromotion() {
				if (!this.productPrice) return new ProductPrice();
				if (!this.productPrice.promotion) return new ProductPrice();
				return this.productPrice.promotion;
			},
			price() {
				if (!this.allowEdit) return null;

				let normal = this.productPriceNormal;
				let promotion = this.productPricePromotion;

				if (normal.value > 0 && promotion.value <= 0) return { to: normal };
				if (normal.value > 0 && promotion.value > 0)
					return { from: normal, to: promotion };
				if (normal.value <= 0 && promotion.value > 0)
					return { from: normal, to: promotion };
				return null;
			},
		},
		watch: {
			product() {
				this.invalidate();
			},
			brandId() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				this.fullTitle = "";
				if (!this.product) return;
				this.fullTitle = await this.product.fetchFullTitle();
			},

			obtainKeyOfSpecificationType(type) {
				if (typeof type === "object") return type.key;
				if (typeof type === "string") return type;
				return "";
			},
		},
	};
</script>

<template>
	<div class="ExportLayoutOne">
		<span class="ExportLayoutOne-title">{{ fullTitle }}</span>

		<div class="ExportLayoutOne-items">
			<Item
				v-for="specification in specifications"
				:key="specification.name"
				:item="specification"
			/>
		</div>

		<span class="ExportLayoutOne-price" v-if="price && price.to">
			{{ price.to }}</span
		>
	</div>
</template>

<style lang="scss" scoped>
	.ExportLayoutOne {
		width: 100%;
		height: 100%;
		padding: 60px;
		gap: 30px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.ExportLayoutOne-title {
			font-size: 30px;
			font-weight: 600;

			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.ExportLayoutOne-items {
			gap: 14px;

			display: flex;
			flex-direction: column;
			align-items: stretch;
		}
		.ExportLayoutOne-price {
			font-size: 30px;
			font-weight: 600;

			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
