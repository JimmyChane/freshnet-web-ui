<script>
	import ItemOrder from "./ItemOrder.vue";
	export default {
		components: { ItemOrder },
		emits: [
			"click-collapse",
			"click-expand",
			"click-pending",
			"click-complete",
			"click-remove",
		],
		props: {
			title: { type: String, default: "" },
			items: { type: Array, default: () => [] },
			currentItemIdSelected: { type: String, default: "" },
		},
	};
</script>

<template>
	<div class="SectionOrder">
		<div class="SectionOrder-header">
			<span class="SectionOrder-title">{{ title }}</span>
			<span class="SectionOrder-count">{{ items.length }}</span>
		</div>
		<ul class="SectionOrder-list">
			<li class="viewOrder-item" v-for="item in items" :key="item.id">
				<div class="viewOrder-item-seperator"></div>
				<ItemOrder
					:expand="currentItemIdSelected === item.id"
					:order="item"
					@onCollapse="$emit('click-collapse', item)"
					@onExpand="$emit('click-expand', item)"
					@onPending="$emit('click-pending', item)"
					@onComplete="$emit('click-complete', item)"
					@onRemove="$emit('click-remove', item)"
				/>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
	.SectionOrder {
		width: 100%;
		max-width: var(--width-max);
		background-color: white;
		box-shadow: 0 2px 4px var(--shadow-light);
		padding: 10px;
		transition: var(--animation-duration);

		.SectionOrder-header {
			margin: 8px 0 2px 0;
			padding: 10px;
			font-weight: 600;
			font-size: 1.2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			gap: 0.4rem;
			.SectionOrder-count {
				background: var(--primary-color);
				font-size: 0.7em;
				width: 1.6em;
				height: 1.6em;
				border-radius: 50%;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				word-break: keep-all;
			}
		}

		.SectionOrder-list {
			display: flex;
			flex-direction: column;
			list-style: none;

			.SectionOrder-list-item {
				display: flex;
				flex-direction: column;

				.SectionOrder-list-item-seperator {
					margin: 4px 0;
					min-width: auto;
					min-height: 0.5px;
					background-color: #d6d6d6;
				}

				.SectionOrder-list-item-body {
					padding: 10px 0;
					border-radius: 10px;
					transition: var(--animation-duration);
					cursor: pointer;

					&:hover {
						background-color: var(--background-color-light);
					}
				}
			}
		}
	}

	.viewOrder-item {
		.viewOrder-item-seperator {
			margin: 4px 0;
			min-width: auto;
			min-height: 0.5px;
			background-color: hsl(0, 0%, 84%);
			background: hsla(0, 0%, 0%, 0.1);
		}
	}
</style>
