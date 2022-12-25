<script>
	import ButtonIcon from "@/components/button/ButtonIcon.vue";

	export default {
		components: { ButtonIcon },
		props: {
			list: { type: Array, default: () => [] },
			placeholder: { type: String, default: "Search" },
		},
		data() {
			return { search: "", searchExpand: false, searchLastCharTime: 0 };
		},
		watch: {
			search(newSearch) {
				this.searchExpand = newSearch;

				const elapseTimeDesigned = 250;
				const date = new Date();
				const time = date.getTime();

				if (time < this.searchLastCharTime) return;

				this.searchLastCharTime = time;
				setTimeout(
					() => this.$emit("callback-search", newSearch),
					elapseTimeDesigned,
				);
			},
		},
		emits: ["callback-search"],
	};
</script>

<template>
	<div class="SearchInput">
		<div
			:class="['SearchInput-body', searchExpand ? 'SearchInput-body-isActive' : '']"
			@click="$refs['SearchInput-keyword'].focus()"
		>
			<ButtonIcon
				:src="host.res(search ? 'icon/close-000000.svg' : 'icon/search-000000.svg')"
				alt="Clear"
				@click="
					search = '';
					searchExpand = false;
					$refs['SearchInput-keyword'].focus();
				"
			/>
			<input
				class="SearchInput-keyword"
				ref="SearchInput-keyword"
				v-model="search"
				:placeholder="placeholder"
				@focus="searchExpand = search"
			/>
		</div>

		<div class="SearchInput-main">
			<div
				ref="SearchInput-main-background"
				class="SearchInput-main-background"
				:style="{
					opacity: [searchExpand ? '1' : '0'],
					'pointer-events': [searchExpand ? 'all' : 'none'],
				}"
				@click="searchExpand = false"
			/>
			<div v-if="searchExpand" class="SearchInput-main-container">
				<div class="SearchInput-main-body">
					<p v-if="!list || list.length <= 0">No Result</p>

					<slot
						:clear="() => (search = '')"
						:expand="() => (searchExpand = true)"
						:collapse="() => (searchExpand = false)"
						:list="list"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.SearchInput {
		--background-color: hsla(0, 0%, 100%, 0.3);
		--background-color-active: white;
		--background-color-focus: white;

		--border-radius: 0.4rem;
		--border-radius-active: 0.4rem;

		--border: 1px solid hsla(0, 0%, 0%, 0.15);
		--border-focus: 1px solid hsla(0, 0%, 0%, 0.15);

		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: 100%;
		height: 100%;
		position: relative;

		.SearchInput-body {
			z-index: 2;
			color: #5c5c5c;
			display: flex;
			flex-direction: row;
			align-items: stretch;
			align-items: center;
			transition: var(--transition-duration);
			width: 100%;
			height: 100%;
			padding: 0.2rem 0.4rem;
			padding: 0.4rem;
			border: var(--border);

			.SearchInput-keyword {
				width: 100%;
				font-size: 1rem;
				flex-grow: 1;
				border: none;
				outline: none;
				padding: 0.5rem 0.7rem;
				padding: 0.5rem;
				border: none;
				background: none;
				transition: var(--transition-duration);
				display: flex;
				flex-direction: row;
				&::placeholder {
					color: hsla(0, 0%, 0%, 0.4);
				}
			}
		}
		.SearchInput-body {
			background-color: var(--background-color);
			border-radius: var(--border-radius);
			&:focus-within {
				background-color: var(--background-color-focus);
				border: var(--border-focus);
			}
		}
		.SearchInput-body-isActive {
			background-color: var(--background-color-active);
			border-radius: var(--border-radius-active) var(--border-radius-active) 0 0;
			&:focus-within {
				background-color: var(--background-color-active);
				border: var(--border-active);
			}
		}

		.SearchInput-main {
			width: 100%;
			height: 0;
			background-color: white;
			border-radius: 0 0 var(--border-radius-active) var(--border-radius-active);
			z-index: 1;

			.SearchInput-main-background {
				min-width: 100vw;
				min-height: 100vh;
				position: fixed;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background-color: hsla(0, 0%, 0%, 0.6);
				display: grid;
				transition: var(--transition-duration);
			}

			.SearchInput-main-container {
				position: absolute;
				top: 0;
				width: 100%;
				height: 100vh;
				max-height: 80vh;
				box-shadow: 0 0 60px hsla(0, 0%, 0%, 0.1);
				border-radius: var(--border-radius-active);
				padding-top: 3rem;
				background-color: #e4e4e4;
				overflow: hidden;

				.SearchInput-main-body {
					width: 100%;
					height: 100%;
					max-height: 80vh;
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 0.4rem;

					border-radius: 0 0 var(--border-radius-active) var(--border-radius-active);

					overflow-y: auto;
					overflow-x: hidden;

					padding: 0.7rem 0.9rem 4rem 0.9rem;
					color: black;

					& > * {
						width: 100%;
					}
				}
			}
		}
	}
</style>
