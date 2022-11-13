<script>
	export default {
		props: {
			menus: { type: Array, default: () => [] },
			index: { type: Number, default: -1 },
		},
	};
</script>

<template>
	<div class="LayoutViewSelector" :style="{ '--item-index': index }">
		<div class="LayoutViewSelector-selection" v-if="index > -1"></div>

		<button
			:class="[
				'LayoutViewSelector-item',
				`LayoutViewSelector-item-${
					index === menus.indexOf(menu) ? 'isSelected' : 'isDeselected'
				}`,
			]"
			v-for="menu of menus"
			:key="menu.title"
			@click="menu.click(menu)"
		>
			<img class="LayoutViewSelector-item-icon" :src="menu.icon" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.LayoutViewSelector {
		position: relative;
		width: max-content;
		height: max-content;
		background-color: #e5ecee;
		box-shadow: inset 0px 0px 0.2rem hsla(0, 0%, 0%, 0.5);
		border-radius: 0.3rem;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		--parent-padding: 0.2rem;
		padding: var(--parent-padding);

		--item-index: 0;
		--item-size: 2.2rem;

		.LayoutViewSelector-selection {
			--padding: calc(var(--parent-padding) * 2);
			--size: calc(var(--item-size) - var(--padding));

			position: absolute;
			left: calc(var(--padding) + var(--item-size) * var(--item-index));
			top: var(--padding);

			z-index: 1;
			width: var(--size);
			height: var(--size);
			background: white;
			box-shadow: 0px 0px 0.3rem hsla(0, 0%, 0%, 0.25);
			border-radius: 0.2rem;
			transition: var(--animation-duration);
		}

		.LayoutViewSelector-item {
			z-index: 2;
			width: var(--item-size);
			height: var(--item-size);
			border: none;
			background: none;
			font-size: 1rem;
			border-radius: 0.2rem;
			transition: var(--animation-duration);

			display: flex;
			align-items: center;
			justify-content: center;

			.LayoutViewSelector-item-icon {
				width: calc(var(--item-size) * 0.8);
				height: calc(var(--item-size) * 0.8);
				border-radius: 0.2rem;
				transition: var(--animation-duration);

				padding: calc(var(--item-size) * 0.2);
			}
		}
		.LayoutViewSelector-item-isDeselected {
			cursor: pointer;

			&:hover {
				.LayoutViewSelector-item-icon {
					background-color: hsla(0, 0%, 100%, 0.4);
				}
			}
		}
	}
</style>
