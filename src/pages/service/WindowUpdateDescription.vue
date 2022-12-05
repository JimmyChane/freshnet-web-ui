<script>
	import Window from "@/components/window/Window.vue";
	import TextArea from "@/components/InputTextArea.vue";

	export default {
		components: { Window, TextArea },
		emits: ["callback-cancel", "callback-change"],
		props: { description: { type: String, default: "" } },
		data() {
			return { value: "" };
		},
		watch: {
			description() {
				this.value = this.description;
			},
		},
		methods: {
			onChange() {
				if (this.description === this.value) {
					this.$root.feedback("No Changes");
					return;
				}

				this.$emit("callback-change", this.value);
			},

			focus() {
				this.$refs.Input.focus();
			},
		},
	};
</script>

<template>
	<Window
		class="WindowDescription"
		title="Edit Description"
		@click-cancel="$emit('callback-cancel')"
		@click-ok="onChange"
	>
		<div class="WindowDescription-main">
			<TextArea
				class="WindowDescription-input"
				ref="Input"
				type="text"
				label="Description"
				:isRequired="true"
				:bindValue="value"
				@input="(comp) => (value = comp.value)"
			/>
		</div>
	</Window>
</template>

<style lang="scss" scoped>
	.WindowDescription {
		width: 35rem;
		max-width: 100%;
		.WindowDescription-main {
			display: flex;
			flex-direction: column;
			gap: 10px;
			.WindowDescription-input {
				height: 7rem;
				background: hsla(0, 0%, 0%, 0.03);
				padding: 0.6rem 0.4rem;
			}
		}
	}
</style>
