<script>
	import Item from "./LayoutNumpad-item.vue";

	export default {
		emits: ["input", "backspace"],
		components: { Item },
		methods: {
			input(x) {
				this.$emit("input", x);
			},
			backspace() {
				this.$emit("backspace");
			},
		},
	};
</script>

<template>
	<div class="LayoutNumpad">
		<Item class="LayoutNumpad-1" @click="() => input(1)" title="1" />
		<Item class="LayoutNumpad-2" @click="() => input(2)" title="2" />
		<Item class="LayoutNumpad-3" @click="() => input(3)" title="3" />
		<Item class="LayoutNumpad-4" @click="() => input(4)" title="4" />
		<Item class="LayoutNumpad-5" @click="() => input(5)" title="5" />
		<Item class="LayoutNumpad-6" @click="() => input(6)" title="6" />
		<Item class="LayoutNumpad-7" @click="() => input(7)" title="7" />
		<Item class="LayoutNumpad-8" @click="() => input(8)" title="8" />
		<Item class="LayoutNumpad-9" @click="() => input(9)" title="9" />
		<Item class="LayoutNumpad-0" @click="() => input(0)" title="0" />
		<Item class="LayoutNumpad-back" @click="() => backspace()" title="<-" />
	</div>
</template>

<style lang="scss" scoped>
	.LayoutNumpad {
		gap: 0.4rem;
		display: grid;
		grid-template-areas: "n1 n2 n3" "n4 n5 n6" "n7 n8 n9" "n0 n0 back";

		.LayoutNumpad-1 {
			grid-area: n1;
		}
		.LayoutNumpad-2 {
			grid-area: n2;
		}
		.LayoutNumpad-3 {
			grid-area: n3;
		}
		.LayoutNumpad-4 {
			grid-area: n4;
		}
		.LayoutNumpad-5 {
			grid-area: n5;
		}
		.LayoutNumpad-6 {
			grid-area: n6;
		}
		.LayoutNumpad-7 {
			grid-area: n7;
		}
		.LayoutNumpad-8 {
			grid-area: n8;
		}
		.LayoutNumpad-9 {
			grid-area: n9;
		}
		.LayoutNumpad-0 {
			grid-area: n0;
		}
		.LayoutNumpad-back {
			grid-area: back;
		}
	}
</style>
