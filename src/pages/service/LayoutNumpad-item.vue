<script>
	export default {
		emits: ["click"],
		props: {
			title: { type: String, default: "" },
		},
		data() {
			return {
				isClicking: false,
			};
		},
		methods: {
			keyDown() {
				const button = this.$refs.button;
				button.classList.remove("LayoutNumpad-item-keyUp");
				button.classList.add("LayoutNumpad-item-keyDown");
			},
			keyUp() {
				const button = this.$refs.button;
				button.classList.remove("LayoutNumpad-item-keyDown");
				button.classList.add("LayoutNumpad-item-keyUp");
			},
			click() {
				this.$emit("click");
			},
		},
	};
</script>

<template>
	<button
		:class="['LayoutNumpad-item', 'LayoutNumpad-item-keyUp']"
		ref="button"
		@mouseup="
			() => {
				isClicking = false;
				keyUp();
			}
		"
		@mousedown="
			() => {
				isClicking = true;
				keyDown();
			}
		"
		@mouseleave="
			() => {
				if (isClicking) keyUp();
			}
		"
		@mouseenter="
			() => {
				if (isClicking) keyDown();
			}
		"
		@click="() => click()"
		><span>{{ title }}</span></button
	>
</template>

<style lang="scss" scoped>
	.LayoutNumpad-item {
		--size: 3rem;
		min-width: var(--size);
		min-height: var(--size);

		box-shadow: 0.1rem 0.1rem 0.1rem hsla(0, 0%, 0%, 0.05);
		border-radius: 0.2rem;
		border: 0.1rem solid hsla(0, 0%, 0%, 0.2);
		background-color: white;
		color: black;
		font-weight: 600;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;

		display: flex;
		align-items: center;
		justify-content: center;
		transition: var(--transition-duration);

		& > * {
			pointer-events: none;
		}
	}

	.LayoutNumpad-item-keyUp {
		&:hover {
			background: hsla(0, 0%, 0%, 0.05);
			box-shadow: none;
		}
	}
	.LayoutNumpad-item-keyDown {
		transform: scale(0.9);
	}
</style>
