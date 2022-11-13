<script>
	const Edge = { LEFT: 1, RIGHT: 2 };
	const Mode = {
		FIXED: 1, // default FIXED_EXPAND
		FIXED_EXPAND: 2,
		FIXED_COLLAPSE: 3,

		DRAWER_EXPAND: 4,
		DRAWER_COLLAPSE: 5,
	};

	export default {
		Edge,
		Mode,

		emits: ["click-collapse"],
		props: {
			mode: { type: Number, default: Mode.DRAWER_COLLAPSE },
			edge: { type: Number, default: Mode.DRAWER_COLLAPSE },
		},
		computed: {
			isLeft: (c) => c.edge === Edge.LEFT,
			isRight: (c) => c.edge === Edge.RIGHT,

			isFixedExpand: (c) =>
				c.mode === Mode.FIXED_EXPAND || c.mode === Mode.FIXED,
			isFixedCollapse: (c) => c.mode === Mode.FIXED_COLLAPSE,
			isDrawer: (c) => c.isDrawerExpand || c.isDrawerCollapse,
			isDrawerExpand: (c) => c.mode === Mode.DRAWER_EXPAND,
			isDrawerCollapse: (c) => c.mode === Mode.DRAWER_COLLAPSE,

			point() {
				if (this.isLeft) {
					return { xStart: "-100%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
				}
				if (this.isRight) {
					return { xStart: "100%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
				}
				return { xStart: "0%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
			},

			classEdge() {
				if (this.isLeft) return "Drawer-LEFT";
				if (this.isRight) return "Drawer-RIGHT";
				return "";
			},
			classMode() {
				if (this.isFixedExpand) return "Drawer-FIXED_EXPAND";
				if (this.isFixedCollapse) return "Drawer-FIXED_COLLAPSE";
				if (this.isDrawerExpand) return "Drawer-DRAWER_EXPAND";
				if (this.isDrawerCollapse) return "Drawer-DRAWER_COLLAPSE";
				return "";
			},

			style() {
				return {
					"--x-start": this.point.xStart,
					"--y-start": this.point.yStart,
					"--x-end": this.point.xEnd,
					"--y-end": this.point.yEnd,
				};
			},
			styleBody() {
				if (this.isDrawer) return "none";
				if (this.isLeft) return { "border-right": "1px solid hsl(0, 0%, 80%)" };
				if (this.isRight) return { "border-left": "1px solid hsl(0, 0%, 80%)" };
				return "none";
			},
		},
	};
</script>

<template>
	<div :class="['Drawer', classEdge, classMode]" :style="style">
		<div class="Drawer-body" :style="styleBody"><slot /></div>

		<div
			class="Drawer-dismissableBox"
			v-if="isDrawer"
			@click="$emit('click-collapse')"
		></div>

		<div class="Drawer-background" v-if="isDrawer"></div>
	</div>
</template>

<style lang="scss" scoped>
	.Drawer {
		display: flex;

		.Drawer-body {
			z-index: 3;
			flex-shrink: 1;
			width: 100%;
			height: 100%;
			max-width: max-content;
			max-height: max-content;
			display: flex;
			flex-direction: column;
		}
		.Drawer-dismissableBox {
			z-index: 2;
			flex-grow: 1;
			width: 100%;
		}
		.Drawer-background {
			z-index: 1;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;

			background-color: hsla(0, 0%, 0%, 0.7);
			pointer-events: none;
			transition: var(--animation-duration);

			// @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
			//    font-size: 1rem;
			//    -webkit-backdrop-filter: blur(0.4em);
			//    backdrop-filter: blur(0.4em);
			// }
		}
	}

	.Drawer-LEFT {
		flex-direction: row;
		top: 0;
		bottom: 0;
		left: 0;
	}
	.Drawer-RIGHT {
		flex-direction: row-reverse;
		top: 0;
		bottom: 0;
		right: 0;
	}

	.Drawer-FIXED_EXPAND {
		width: max-content;
		height: 100%;
		position: sticky;

		.Drawer-body {
			transition-duration: var(--animation-duration);
			transition-timing-function: cubic-bezier(1, 0, 0, 1);
			transform: translateX(var(--x-end)) translateY(var(--y-end));
		}
	}
	.Drawer-FIXED_COLLAPSE {
		width: max-content;
		height: 100%;
		position: sticky;

		.Drawer-body {
			transition-duration: var(--animation-duration);
			transition-timing-function: cubic-bezier(1, 0, 0, 1);
			transform: translateX(var(--x-start)) translateY(var(--y-start));
			box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
		}
	}

	.Drawer-DRAWER_EXPAND {
		height: 100%;
		width: 100%;
		position: absolute;

		.Drawer-body {
			transition-duration: var(--animation-duration);
			transition-timing-function: cubic-bezier(1, 0, 0, 1);
			transform: translateX(var(--x-end)) translateY(var(--y-end));
			box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
		}
		.Drawer-dismissableBox {
			display: block;
		}
		.Drawer-background {
			opacity: 1;
		}
	}
	.Drawer-DRAWER_COLLAPSE {
		height: 100%;
		width: 100%;
		position: absolute;
		pointer-events: none;

		.Drawer-body {
			transition-duration: var(--animation-duration);
			transition-timing-function: cubic-bezier(1, 0, 0, 1);
			transform: translateX(var(--x-start)) translateY(var(--y-start));
			box-shadow: none;
		}
		.Drawer-dismissableBox {
			display: none;
		}
		.Drawer-background {
			opacity: 0;
		}
	}
</style>
