<script>
	import MenuButton from "@/components/button/MenuButton.vue";
	import Button3 from "@/components/button/Button3.vue";
	import ItemSpecification from "./ItemSpecification.vue";

	export default {
		components: { MenuButton, Button3, ItemSpecification },
		emtis: ["click", "click-remove"],
		props: {
			item: { type: Object, default: null },
			selected: { type: Boolean, default: false },
		},
		computed: {
			category() {
				const { categoryKey } = this.item;

				return this.categoryStore.getters.items.find((category) => {
					return category.key === categoryKey;
				});
			},
		},
		mounted() {
			this.categoryStore.dispatch("getItems");
		},
	};
</script>

<template>
	<div class="ItemDevice" :selected="selected" :isSelectable="false">
		<div class="ItemDevice-body" v-if="item">
			<div class="ItemDevice-header">
				<div class="ItemDevice-header-category" v-if="category">
					<img
						class="ItemDevice-header-category-icon"
						:src="category.icon.toUrl()"
					/>
					<span class="ItemDevice-header-category-title">{{ category.title }}</span>
				</div>
				<span class="ItemDevice-header-category-notFound" v-if="!category"
					>Category Not Found</span
				>
				<div class="ItemDevice-header-end">
					<MenuButton
						:menus="[
							{
								key: 'updateDescription',
								title: 'Update Description',
								interact: () => $emit('click-update-description', { item }),
							},
							{
								key: 'updateSpecification',
								title: 'Update Specifications',
								interact: () => $emit('click-update-specifications', { item }),
							},
							{
								key: 'delete',
								title: 'Delete',
								color: '#DB4A2A',
								icon: host.res('icon/trash-DB4A2A.svg'),
								interact: () => $emit('click-remove', { item }),
							},
						]"
						:icon="host.res('icon/option-2A4858.svg')"
					/>
				</div>
			</div>

			<div
				class="ItemDevice-main"
				v-if="item.specifications.length || item.description"
			>
				<div class="ItemDevice-description" v-if="item.description">
					<span class="ItemDevice-description-body">{{ item.description }}</span>
				</div>

				<div class="ItemDevice-specification" v-if="item.specifications.length">
					<ItemSpecification
						v-for="specification of item.specifications"
						:key="`${specification.typeKey}${specification.content}`"
						:item="specification"
					/>
				</div>
			</div>
		</div>
		<div class="ItemDevice-notFound" v-if="!item">
			<span class="ItemDevice-notFound-title">Device Not Found</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemDevice-reuse-title {
		font-size: 0.6rem;
	}
	.ItemDevice-reuse-dot {
		--size: 0.3rem;
		width: var(--size);
		height: var(--size);
		min-height: var(--size);
		max-width: var(--size);
		min-width: var(--size);
		max-height: var(--size);
		display: flex;
		background: #2a4858;
		border-radius: 50%;
	}

	.ItemDevice {
		width: 100%;
		border-radius: 8px;
		background: white;
		border: 1px solid hsla(0, 0%, 0%, 0.2);
		.ItemDevice-body {
			width: 100%;
			font-weight: 400;
			font-size: 1rem;
			color: black;
			text-align: start;
			flex-grow: 1;
			height: unset;
			display: flex;
			flex-direction: column;
			align-items: stretch;

			.ItemDevice-header {
				padding: 0.4rem 0.8rem;
				width: 100%;
				column-gap: 0.5rem;
				color: #2a4858;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				.ItemDevice-header-category {
					overflow: hidden;
					column-gap: 0.5rem;
					display: flex;
					flex-direction: row;
					flex-grow: 1;
					flex-wrap: nowrap;
					align-items: center;
					.ItemDevice-header-category-icon {
						--size: 1.2rem;
						width: var(--size);
						height: var(--size);
					}
				}
				.ItemDevice-header-category-notFound {
					flex-grow: 1;
					font-size: 0.8rem;
				}

				.ItemDevice-header-end {
					display: flex;
					flex-direction: row;
					flex-grow: 0;
				}
			}
			.ItemDevice-main {
				--padding-vertical: 0.6rem;
				--padding-horizontal: 0.8rem;
				--padding: var(--padding-vertical) var(--padding-horizontal);
				line-height: 1.1;

				display: flex;
				flex-direction: column;
				align-items: stretch;

				.ItemDevice-description {
					width: 100%;
					display: flex;
					flex-direction: column;
					border-top: 1px solid hsla(0, 0%, 0%, 0.2);
					padding: var(--padding);

					.ItemDevice-description-body {
						width: 100%;
						display: flex;
						line-height: 1.1;
						font-size: 0.9rem;
						white-space: pre-line;
						word-wrap: break-word;
					}
				}
				.ItemDevice-specification {
					width: 100%;
					line-height: 1.1;
					font-size: 0.9rem;
					gap: 0.2rem;
					display: flex;
					flex-direction: column;
					border-top: 1px solid hsla(0, 0%, 0%, 0.2);
					padding: var(--padding);
				}

				.ItemDevice-customer {
					display: flex;
					flex-direction: column;
					padding: var(--padding);

					.ItemDevice-customer-body {
						flex-grow: 100;
						display: flex;
						flex-direction: row;
						align-items: center;
						flex-wrap: wrap;
						column-gap: 0.5rem;
						font-size: 0.9rem;
					}
				}
				.ItemDevice-serialNumber {
					width: 100%;
					display: flex;
					flex-direction: column;
					padding: var(--padding);

					.ItemDevice-description-body {
						width: 100%;
						display: flex;
						line-height: 1.1;
						font-size: 0.9rem;
						white-space: pre-line;
					}
				}
			}
		}
		.ItemDevice-notFound {
			display: flex;
			flex-direction: row;
			align-items: center;
			.ItemDevice-notFound-title {
				flex-grow: 1;
			}
		}
	}
</style>
