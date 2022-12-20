<script>
	class Visibility {
		static Show = "show";
		static Hide = "hide";
	}

	class Directions {
		static Top = "top";
		static Bottom = "bottom";
		static Left = "left";
		static Right = "right";

		static TopLeft = "topLeft";
		static TopRight = "topRight";
		static BottomLeft = "bottomLeft";
		static BottomRight = "bottomRight";
	}

	export default {
		Visibility,
		Directions,

		props: {
			menus: { type: Array, default: () => [] },
			direction: { type: String, default: Directions.BottomLeft },
		},
		data() {
			return { isShowing: false, dropdownDisplay: "none" };
		},
		computed: {
			classDirection() {
				const { Top, Bottom, Left, Right } = Directions;
				const { TopLeft, TopRight, BottomLeft, BottomRight } = Directions;

				if (this.direction === Top) return "ButtonOption2-dropdown-top";
				if (this.direction === Bottom) return "ButtonOption2-dropdown-bottom";
				if (this.direction === Left) return "ButtonOption2-dropdown-left";
				if (this.direction === Right) return "ButtonOption2-dropdown-right";
				if (this.direction === TopLeft) return "ButtonOption2-dropdown-topLeft";
				if (this.direction === TopRight) return "ButtonOption2-dropdown-topRight";
				if (this.direction === BottomLeft) return "ButtonOption2-dropdown-bottomLeft";
				if (this.direction === BottomRight)
					return "ButtonOption2-dropdown-bottomRight";

				return "";
			},
		},
		watch: {
			isShowing() {
				this.$emit(
					"visibility-change",
					this.isShowing ? Visibility.Show : Visibility.Hide,
				);
			},
		},
		methods: {
			toggle() {
				if (this.isShowing) this.hide();
				else this.show();
			},
			show() {
				this.dropdownDisplay = "flex";
				setTimeout(() => (this.isShowing = true), 100);
			},
			hide() {
				setTimeout(() => {
					this.isShowing = false;
					setTimeout(() => (this.dropdownDisplay = "none"), 100);
				}, 100);
			},
		},
	};
</script>

<template>
	<div class="ButtonOption2" :class="[isShowing ? 'ButtonOption2-shown' : '']">
		<button
			class="ButtonOption2-main"
			@mouseover="(x) => $emit('mouseover', x)"
			@mouseleave="(x) => $emit('mouseleave', x)"
			@click="() => toggle()"
			@blur="hide()"
		>
			<div class="ButtonOption2-slot">
				<slot />
			</div>
		</button>

		<div
			class="ButtonOption2-dropdown"
			:class="[classDirection]"
			:style="{ display: dropdownDisplay }"
		>
			<button
				class="ButtonOption2-dropdown-item"
				v-for="menu in menus"
				:key="menu.key"
				@click="
					() => {
						if (typeof menu.click === 'function') {
							menu.click();
						}
						hide();
					}
				"
			>
				<img
					class="ButtonOption2-dropdown-item-icon"
					v-if="menu.icon"
					:src="menu.icon"
				/>
				<span
					class="ButtonOption2-dropdown-item-title"
					v-if="menu.title"
					:style="{
						color: typeof menu.color === 'string' ? menu.color : '#000000',
						'font-weight': menu['font-weight'] ? menu['font-weight'] : '400',
					}"
					>{{ menu.title }}</span
				>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ButtonOption2 {
		font-size: 1rem;

		--size-dropdown: 0.4em;

		position: relative;
		width: fit-content;
		height: fit-content;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		transition: var(--transition-duration);
		font-weight: 600;

		.ButtonOption2-main {
			font-size: inherit;

			z-index: 1;
			width: inherit;
			height: inherit;
			cursor: pointer;
			transition: var(--transition-duration);
			border: none;
			background: none;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			border-radius: inherit;

			&:hover,
			&:focus-within {
				background-color: hsla(0, 0%, 0%, 0.1);
			}
		}
		.ButtonOption2-slot {
			font-size: inherit;

			z-index: 0;
			width: inherit;
			height: inherit;
			overflow: hidden;
			padding: 0.6em;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.ButtonOption2-dropdown {
			font-size: inherit;

			z-index: 1;
			position: absolute;
			width: initial;
			min-width: 9em;
			height: initial;
			opacity: 0;
			overflow: hidden;
			border: none;
			border-radius: 0.4em;
			background-color: white;
			box-shadow: none;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-items: stretch;
			pointer-events: none;
			transition: var(--transition-duration);
			transform: translateX(0%) translateY(0%) scale(0);
			.ButtonOption2-dropdown-item {
				font-size: inherit;

				z-index: 3;
				width: initial;
				min-width: 9em;
				height: initial;
				overflow: hidden;
				padding: 1em 1.2em;
				border: none;
				background: none;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				gap: 1em;
				cursor: pointer;
				transition: var(--transition-duration);
				&:hover {
					background-color: hsla(0, 0%, 0%, 0.05);
				}
				.ButtonOption2-dropdown-item-icon {
					--icon-size: 1em;
					width: var(--icon-size);
					height: var(--icon-size);
					max-width: initial;
					max-height: initial;
				}
				.ButtonOption2-dropdown-item-title {
					flex-grow: 1;
					min-width: max-content;
					text-align: start;
					font-size: 0.9em;
					font-weight: 400;
					color: black;
				}
			}
		}
	}
	.ButtonOption2-shown {
		.ButtonOption2-dropdown {
			opacity: 1;
			pointer-events: initial;
			box-shadow: 0px 0px 20px hsla(0, 0%, 0%, 0.25);
		}

		.ButtonOption2-dropdown-top {
			transform: translateX(0) translateY(calc(-64% + var(--size-dropdown))) scale(1);
		}
		.ButtonOption2-dropdown-bottom {
			transform: translateX(0) translateY(calc(58% + var(--size-dropdown))) scale(1);
		}
		.ButtonOption2-dropdown-left {
			transform: translateX(calc(-52% - var(--size-dropdown))) translateY(0) scale(1);
		}
		.ButtonOption2-dropdown-right {
			transform: translateX(calc(62% - var(--size-dropdown))) translateY() scale(1);
		}
		.ButtonOption2-dropdown-topLeft {
			transform: translateX(calc(-52% - var(--size-dropdown)))
				translateY(calc(-64% + var(--size-dropdown))) scale(1);
		}
		.ButtonOption2-dropdown-topRight {
			transform: translateX(calc(62% - var(--size-dropdown)))
				translateY(calc(-64% + var(--size-dropdown))) scale(1);
		}
		.ButtonOption2-dropdown-bottomLeft {
			transform: translateX(calc(-52% - var(--size-dropdown)))
				translateY(calc(58% + var(--size-dropdown))) scale(1);
		}
		.ButtonOption2-dropdown-bottomRight {
			transform: translateX(calc(62% - var(--size-dropdown)))
				translateY(calc(58% + var(--size-dropdown))) scale(1);
		}
	}
</style>
