<script>
	export default {
		props: {
			isThin: { type: Boolean, default: false },
			title: { type: String, default: "" },
			description: { type: String, default: "" },
			links: { type: Array, default: () => [] },
		},
		computed: {
			firstLink() {
				return this.links.length ? this.links[0] : null;
			},
			titleClick() {
				if (!this.firstLink) return "";
				return `Click to ${this.firstLink.title}`;
			},
			href() {
				if (this.firstLink) {
					return this.firstLink.href;
				}
			},
			target() {
				if (this.firstLink) return this.firstLink.target;
			},
		},
	};
</script>

<template>
	<a
		:class="[
			'HomeSectionContact',
			`HomeSectionContact-${isThin ? 'isThin' : 'isWide'}`,
		]"
		:href="href"
		:target="target"
	>
		<div class="HomeSectionContact-main">
			<span class="HomeSectionContact-title">{{ title }}</span>

			<span class="HomeSectionContact-content">{{ description }}</span>

			<div class="HomeSectionContact-icons" v-if="links.length">
				<a
					class="HomeSectionContact-link"
					v-for="link of links"
					:key="link.title"
					:href="link.href"
					:target="link.target"
				>
					<img
						class="HomeSectionContact-icon"
						:src="link.icon"
						:alt="link.title"
					/>
				</a>
			</div>
		</div>
	</a>
</template>

<style lang="scss" scoped>
	.HomeSectionContact {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		// background: linear-gradient(101deg, #ad5dd3 0%, #742998 100%);
		background-color: #ffffff;

		border-radius: 1em;
		overflow: hidden;
		color: black;

		text-decoration: none;
		position: relative;
		transition: var(--animation-duration);
		aspect-ratio: 16/8;

		&:hover,
		&:focus {
			transform: scale(1.01);
			box-shadow: 0px 0px 1.5rem hsla(0, 0%, 0%, 0.05);
			text-decoration: underline;
		}

		.HomeSectionContact-main {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			align-items: flex-start;
			justify-content: center;
			padding: 2em;
			height: 100%;
			max-height: 12em;
			z-index: 2;
			padding: 1em;

			.HomeSectionContact-title {
				font-weight: 600;
				font-size: 1.9em;

				font-size: 1em;
			}
			.HomeSectionContact-content {
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				font-size: 0.8em;
			}
			.HomeSectionContact-icons {
				font-size: 1.5em;
				font-size: 1em;
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 0.3em;

				.HomeSectionContact-link {
					padding: 0.5em;
					display: flex;
					border-radius: 50%;
					border: 1px solid transparent;
					transition: var(--animation-duration);
					&:hover {
						background-color: hsla(0, 0%, 0%, 0.05);
						border: 1px solid hsla(0, 0%, 0%, 0.1);
					}
					.HomeSectionContact-icon {
						width: 1em;
						height: 1em;
					}
				}
			}
		}
	}
	.HomeSectionContact-isThin {
		width: 100%;
		height: 100%;
		font-size: 1rem;
	}
	.HomeSectionContact-isWide {
		width: 100%;
		height: 100%;
		font-size: 1.3rem;
	}
</style>
