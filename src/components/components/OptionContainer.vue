<script>
	const Mode = { Show: "show", Hide: "hide" };

	export default {
		Mode,

		props: {
			menus: { type: Array, default: () => [] },
		},
		data() {
			return { isShowing: false, dropdownDisplay: "none" };
		},
		watch: {
			isShowing() {
				this.$emit("mode-change", this.isShowing ? Mode.Show : Mode.Hide);
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
	<div class="OptionContainer" :class="[isShowing ? 'OptionContainer-shown' : '']">
		<button
			class="OptionContainer-main"
			@mouseover="(x) => $emit('mouseover', x)"
			@mouseleave="(x) => $emit('mouseleave', x)"
			@click="() => toggle()"
			@blur="hide()"
		>
			<div class="OptionContainer-slot">
				<slot />
			</div>
		</button>

		<div class="OptionContainer-dropdown" :style="{ display: dropdownDisplay }">
			<button
				class="OptionContainer-dropdown-body"
				v-for="menu in menus"
				:key="menu.key"
				@click="
					menu.interact();
					hide();
				"
			>
				<img
					class="OptionContainer-dropdown-icon"
					v-if="menu.icon"
					:src="menu.icon"
				/>
				<span
					class="OptionContainer-dropdown-title"
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
	.OptionContainer {
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

		.OptionContainer-main {
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
		.OptionContainer-slot {
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

		.OptionContainer-dropdown {
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
			.OptionContainer-dropdown-body {
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
				.OptionContainer-dropdown-icon {
					--icon-size: 1em;
					width: var(--icon-size);
					height: var(--icon-size);
					max-width: initial;
					max-height: initial;
				}
				.OptionContainer-dropdown-title {
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
	.OptionContainer-shown {
		.OptionContainer-dropdown {
			opacity: 1;
			pointer-events: initial;
			box-shadow: 0 0 0.5em 0 hsla(0, 0%, 0%, 0.2);
			box-shadow: 0px 0px 20px hsla(0, 0%, 0%, 0.25);
			transform: translateX(calc(-52% - var(--size-dropdown)))
				translateY(calc(58% + var(--size-dropdown))) scale(1);
		}
	}
</style>
