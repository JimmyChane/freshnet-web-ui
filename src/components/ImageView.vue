<script>
	export default {
		props: {
			src: { type: String, defualt: "" },
			alt: { type: String, defualt: "" },
		},
		data() {
			return {
				isShowing: false,
				bindSrc: "",

				isError: false,
			};
		},
		watch: {
			src() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			invalidate() {
				this.isShowing = false;
				this.isError = false;

				// if bind is empty
				if (this.bindSrc === "") {
					this.bindSrc = this.src;
					this.isShowing = true;
				} else {
					const src = this.src;
					setTimeout(() => {
						if (src !== this.src) return;
						this.bindSrc = "";
						this.bindSrc = this.src;
						this.isShowing = true;
					}, 300);
				}
			},

			onLoad(event) {
				const { img } = this.$refs;
				if (img) {
					this.isError = img.completed;
				}
				this.$emit("load", event);
			},
			onError(event) {
				this.isError = true;
				this.$emit("error", event);
			},
			onAbort(event) {
				this.isError = true;
				this.$emit("abort", event);
			},
		},
	};
</script>

<template>
	<span v-if="isError" class="ImageView2-error">Error</span>
	<img
		v-else
		:class="[
			'ImageView2-img',
			isShowing ? 'ImageView2-img-isShowing' : 'ImageView2-img-isHiding',
		]"
		ref="img"
		:src="bindSrc"
		:alt="alt"
		@load="(event) => onLoad(event)"
		@error="(event) => onError(event)"
		@abort="(event) => onAbort(event)"
		@click="(event) => $emit('click', event)"
	/>
</template>

<style lang="scss" scoped>
	.ImageView2-error {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		font-size: 0.8em;
		background: hsla(0, 0%, 0%, 0.1);
		color: hsla(0, 0%, 0%, 0.6);
	}
	.ImageView2-img {
		display: flex;

		transition: var(--animation-duration);
	}
	.ImageView2-img-isShowing {
		transform: scale(1);
		opacity: 1;
	}
	.ImageView2-img-isHiding {
		transform: scale(0.9);
		opacity: 0.2;
	}
</style>
